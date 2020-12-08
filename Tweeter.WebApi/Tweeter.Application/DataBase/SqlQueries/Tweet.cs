namespace Tweeter.Application.DataBase.SqlQueries
{
	public class Tweet
	{
		public const string SearchTweets = @"
			--DECLARE 
--			@textContains as nvarchar(500) = null,
--			@createdById as int = null, 
--			@onlyWithComments as bit = null,
--			@onlyWithMedia as bit = null, 
--			@onlyLikedByUserId as int = null,
--			@followerId as int = null,
--			@currentUserId as int = 1,
--			@idLessThan as int = null,
--			@createdByIdOrFollowerId as bit = null,
--			@bookmarkedByUserId as int = 1,

--			@sortProp as nvarchar(100) = 't.id',
--			@sortDirection as nvarchar(100) = 'asc', 

--			@pageNumber AS INT = 1, 
--			@pageSize AS INT = 100

			DECLARE @sql NVARCHAR(MAX);
			DECLARE @params NVARCHAR(500);
			declare @orderBy nvarchar(500);
			declare @paging nvarchar(500);
			declare @join nvarchar(500) = '';

			SET @params = '@textContains nvarchar,
							@createdById int,
							@onlyWithComments bit,
							@pageNumber int,
							@pageSize int,
							@onlyWithMedia bit,
							@onlyLikedByUserId int,
							@followerId int,
							@currentUserId int,
							@idLessThan int,
							@bookmarkedByUserId int';

			SET @sql = 'SELECT t.[Id]
			  ,t.[CreatedById]
			  ,t.[CreatedAt]
			  ,t.[ImgUrl]
			  ,t.[Text]
			  ,t.[RetweetedFromId]
			  ,t.[LikeCount]
			  ,t.[RetweetCount]
			  ,t.[BookmarkCount]
			  ,t.[CommentCount]
			  ,t.[OnlyFollowedCanReply]
			  ,CASE WHEN EXISTS(
					select top(1) * from dbo.TweetComment tc where tc.TweetId = t.Id and tc.CreatedById = @currentUserId
				) THEN 1 ELSE 0 END AS IsCommentedByCurrentUser
			  ,CASE WHEN EXISTS(
					select top(1) * from dbo.TweetLike tl where tl.TweetId = t.Id and tl.UserId = @currentUserId
				) THEN 1 ELSE 0 END AS IsLikedByCurrentUser
			  ,CASE WHEN EXISTS(
					select top(1) * from dbo.TweetBookmark tb where tb.TweetId = t.Id and tb.UserId = @currentUserId
				) THEN 1 ELSE 0 END AS IsBookmarkedByCurrentUser
			  ,CASE WHEN EXISTS(
					select top(1) * from dbo.Tweet t2 where t2.CreatedById = @currentUserId and t2.RetweetedFromId = t.Id
				) THEN 1 ELSE 0 END AS IsRetweetedByCurrentUser

				,0 as _split_
				,u.Id
				,u.FollowersCount
				,u.FolloweesCount
				,u.AvatarUrl
				,u.Name
				,u.About
				,u.ProfileCoverUrl

				,0 as _split_
				,originalTweets.Id
				,originalTweets.[CreatedById]
			    ,originalTweets.[CreatedAt]
			    ,originalTweets.[ImgUrl]
			    ,originalTweets.[Text]
			    ,originalTweets.[RetweetedFromId]
			    ,originalTweets.[LikeCount]
			    ,originalTweets.[RetweetCount]
			    ,originalTweets.[BookmarkCount]
				,originalTweets.[CommentCount]
			    ,originalTweets.[OnlyFollowedCanReply]
				,CASE WHEN EXISTS(
					select top(1) * from dbo.TweetComment tc where tc.TweetId = originalTweets.Id and tc.CreatedById = @currentUserId
				) THEN 1 ELSE 0 END AS IsCommentedByCurrentUser
			    ,CASE WHEN EXISTS(
					select top(1) * from dbo.TweetLike tl where tl.TweetId = originalTweets.Id and tl.UserId = @currentUserId
				) THEN 1 ELSE 0 END AS IsLikedByCurrentUser
			    ,CASE WHEN EXISTS(
					select top(1) * from dbo.TweetBookmark tb where tb.TweetId = originalTweets.Id and tb.UserId = @currentUserId
				) THEN 1 ELSE 0 END AS IsBookmarkedByCurrentUser
				,CASE WHEN EXISTS(
					select top(1) * from dbo.Tweet t2 where t2.CreatedById = @currentUserId and t2.RetweetedFromId = originalTweets.Id
				) THEN 1 ELSE 0 END AS IsRetweetedByCurrentUser

				,0 as _split_
				,otu.Id
				,otu.FollowersCount
				,otu.FolloweesCount
				,otu.AvatarUrl
				,otu.Name
				,otu.About
				,otu.ProfileCoverUrl

				,0 as _split_
				,COUNT(*) OVER() TotalCount

				,(select CreatedAt from dbo.TweetBookmark tb where (tb.TweetId = t.Id AND tb.UserId = @bookmarkedByUserId) OR (tb.TweetId = t.RetweetedFromId AND tb.UserId = @bookmarkedByUserId)) as BookmarkDate

			FROM dbo.Tweet t
			';

			-- join setup ---------------------------------
			set @join = @join + '
			LEFT JOIN dbo.AspNetUsers u ON u.Id = t.CreatedById
			LEFT JOIN dbo.Tweet originalTweets ON originalTweets.Id = t.RetweetedFromId
			LEFT JOIN dbo.AspNetUsers otu ON otu.Id = originalTweets.CreatedById
			';

			set @sql = @sql + @join;

			-- filtering setup ----------------------------
			set @sql = @sql + '
			where 1=1';

			IF @textContains IS NOT NULL
			SET @sql = @sql + '
			AND (t.[Text] LIKE ''%'' + ''' + @textContains + ''' + ''%'' OR originalTweets.[Text] LIKE ''%'' + ''' + @textContains + ''' + ''%'')';
 
			IF @createdById IS NOT NULL and (@createdByIdOrFollowerId is null or @createdByIdOrFollowerId = 0) 
			SET @sql = @sql + ' 
			AND t.[CreatedById] = @createdById';

			IF @idLessThan IS NOT NULL
			SET @sql = @sql + ' 
			AND t.Id < @idLessThan';

			IF @onlyWithComments IS NOT NULL AND @onlyWithComments = 1
			SET @sql = @sql + ' 
			AND EXISTS (
				select top(1) tc.Id from dbo.TweetComment tc where tc.TweetId = t.Id
				union
				select top(1) tc.Id from dbo.TweetComment tc where tc.TweetId = originalTweets.Id
			)';

			IF @onlyWithMedia IS NOT NULL AND @onlyWithMedia = 1
			SET @sql = @sql + ' 
			AND (t.ImgUrl IS NOT NULL OR originalTweets.ImgUrl IS NOT NULL)';

			IF @onlyLikedByUserId IS NOT NULL
			SET @sql = @sql + ' 
			AND EXISTS (
				select top(1) * from dbo.TweetLike tl where tl.TweetId = t.Id and tl.UserId = @onlyLikedByUserId
				union
				select top(1) * from dbo.TweetLike tl where tl.TweetId = originalTweets.Id and tl.UserId = @onlyLikedByUserId
			) AND t.RetweetedFromId IS NULL';

			IF @bookmarkedByUserId IS NOT NULL
			SET @sql = @sql + ' 
			AND EXISTS (
				select top(1) * from dbo.TweetBookmark tb where tb.TweetId = t.Id and tb.UserId = @bookmarkedByUserId
				union
				select top(1) * from dbo.TweetBookmark tb where tb.TweetId = originalTweets.Id and tb.UserId = @bookmarkedByUserId
			) AND t.RetweetedFromId IS NULL';

			IF @followerId IS NOT NULL and (@createdByIdOrFollowerId is null or @createdByIdOrFollowerId = 0) 
			SET @sql = @sql + ' 
			AND EXISTS (select top(1) * from dbo.Follow f where f.FolloweeId = t.CreatedById and f.FollowerId = @followerId)';

			IF @createdByIdOrFollowerId IS NOT NULL and @createdByIdOrFollowerId = 1
			SET @sql = @sql + ' 
			AND (t.CreatedById = @createdById or EXISTS (select top(1) * from dbo.Follow f where f.FolloweeId = t.CreatedById and f.FollowerId = @followerId))';

			-- sorting setup ----------------------------
			if @bookmarkedByUserId is not null
				set @orderBy = '
			ORDER BY BookmarkDate DESC';
			else set @orderBy = ' 
			ORDER BY ' + @sortProp + ' ' + @sortDirection;

			SET @sql = @sql + @orderBy;

			-- paging setup -----------------------------
			set @paging = ' 
			OFFSET (@pageNumber - 1) * @pageSize ROWS FETCH NEXT @pageSize ROWS ONLY';
			set @sql = @sql + @paging;
 
			print(@sql)

			EXEC sp_Executesql     
					@sql,  
					@params, 
					@textContains = @textContains,
					@createdById = @createdById,
					@onlyWithComments = @onlyWithComments,
					@pageNumber = @pageNumber,
					@pageSize = @pageSize,
					@onlyLikedByUserId = @onlyLikedByUserId,
					@onlyWithMedia = @onlyWithMedia,
					@followerId = @followerId,
					@currentUserId = @currentUserId,
					@idLessThan = @idLessThan,
					@bookmarkedByUserId = @bookmarkedByUserId
";

		public const string GetById = @"
			SELECT t.[Id]
			  ,t.[CreatedById]
			  ,t.[CreatedAt]
			  ,t.[ImgUrl]
			  ,t.[Text]
			  ,t.[RetweetedFromId]
			  ,t.[LikeCount]
			  ,t.[RetweetCount]
			  ,t.[BookmarkCount]
			  ,t.[CommentCount]
			  ,t.[OnlyFollowedCanReply]
			  ,CASE WHEN EXISTS(
					select top(1) * from dbo.TweetComment tc where tc.TweetId = t.Id and tc.CreatedById = @currentUserId
				) THEN 1 ELSE 0 END AS IsCommentedByCurrentUser
			  ,CASE WHEN EXISTS(
					select top(1) * from dbo.TweetLike tl where tl.TweetId = t.Id and tl.UserId = @currentUserId
				) THEN 1 ELSE 0 END AS IsLikedByCurrentUser
			  ,CASE WHEN EXISTS(
					select top(1) * from dbo.TweetBookmark tb where tb.TweetId = t.Id and tb.UserId = @currentUserId
				) THEN 1 ELSE 0 END AS IsBookmarkedByCurrentUser
			  ,CASE WHEN EXISTS(
					select top(1) * from dbo.Tweet t2 where t2.CreatedById = @currentUserId and t2.RetweetedFromId = t.Id
				) THEN 1 ELSE 0 END AS IsRetweetedByCurrentUser

				,0 as _split_
				,u.Id
				,u.FollowersCount
				,u.FolloweesCount
				,u.AvatarUrl
				,u.Name
				,u.About
				,u.ProfileCoverUrl

				,0 as _split_
				,originalTweets.Id
				,originalTweets.[CreatedById]
			    ,originalTweets.[CreatedAt]
			    ,originalTweets.[ImgUrl]
			    ,originalTweets.[Text]
			    ,originalTweets.[RetweetedFromId]
			    ,originalTweets.[LikeCount]
			    ,originalTweets.[RetweetCount]
			    ,originalTweets.[BookmarkCount]
				,originalTweets.[CommentCount]
			    ,originalTweets.[OnlyFollowedCanReply]
				,CASE WHEN EXISTS(
					select top(1) * from dbo.TweetComment tc where tc.TweetId = originalTweets.Id and tc.CreatedById = @currentUserId
				) THEN 1 ELSE 0 END AS IsCommentedByCurrentUser
			    ,CASE WHEN EXISTS(
					select top(1) * from dbo.TweetLike tl where tl.TweetId = originalTweets.Id and tl.UserId = @currentUserId
				) THEN 1 ELSE 0 END AS IsLikedByCurrentUser
			    ,CASE WHEN EXISTS(
					select top(1) * from dbo.TweetBookmark tb where tb.TweetId = originalTweets.Id and tb.UserId = @currentUserId
				) THEN 1 ELSE 0 END AS IsBookmarkedByCurrentUser
				,CASE WHEN EXISTS(
					select top(1) * from dbo.Tweet t2 where t2.CreatedById = @currentUserId and t2.RetweetedFromId = originalTweets.Id
				) THEN 1 ELSE 0 END AS IsRetweetedByCurrentUser

				,0 as _split_
				,otu.Id
				,otu.FollowersCount
				,otu.FolloweesCount
				,otu.AvatarUrl
				,otu.Name
				,otu.About
				,otu.ProfileCoverUrl

			FROM dbo.Tweet t
			JOIN dbo.AspNetUsers u ON u.Id = t.CreatedById
			LEFT JOIN dbo.Tweet originalTweets ON originalTweets.Id = t.RetweetedFromId
			LEFT JOIN dbo.AspNetUsers otu ON otu.Id = originalTweets.CreatedById
			WHERE t.Id = @id;
";
	}
}
