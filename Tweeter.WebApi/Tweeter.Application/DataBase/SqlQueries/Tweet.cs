namespace Tweeter.Application.DbModel.SqlQueries
{
	public class Tweet
	{
		public const string SearchTweets = @"
			DECLARE 
			@text as nvarchar(100) = @text_, 
			@createdById as int = @createdBy_, 
			@onlyWithComments as bit = @onlyWithComments_,
			@onlyWithMedia as bit = @onlyWithMedia_, 
			@onlyLikedByUserId as int = @onlyLikedByUserId_,
			@followerId as int = @followerId_,
			@currentUserId as int = @currentUserId_,

			@sortProp as nvarchar(100) = @sortProp_,
			@sortDirection as nvarchar(100) = @sortDirection_, 

			@pageNumber AS INT = @pageNumber_, 
			@pageSize AS INT = @pageSize_

			DECLARE @sql NVARCHAR(MAX);
			DECLARE @params NVARCHAR(500);
			declare @orderBy nvarchar(500);
			declare @paging nvarchar(500);

			SET @params = '@text nvarchar,
							@createdById int,
							@onlyWithComments bit,
							@pageNumber int,
							@pageSize int,
							@onlyWithMedia bit,
							@onlyLikedByUserId int,
							@followerId int,
							@currentUserId int';

			SET @sql = 'SELECT t.[Id]
			  ,t.[CreatedById]
			  ,t.[CreatedAt]
			  ,t.[ImgUrl]
			  ,t.[Text]
			  ,t.[RetweetedFromId]
			  ,t.[LikeCount]
			  ,t.[RetweetCount]
			  ,t.[BookmarkCount]
			  ,t.[OnlyFollowedCanReply]
			  ,CASE WHEN EXISTS(
					select * from dbo.TweetComment tc where tc.TweetId = t.Id and tc.CreatedById = @currentUserId
				) THEN 1 ELSE 0 END AS IsCommentedByCurrentUser
			  ,CASE WHEN EXISTS(
					select * from dbo.TweetLike tl where tl.TweetId = t.Id and tl.UserId = @currentUserId
				) THEN 1 ELSE 0 END AS IsLikedByCurrentUser
			  ,CASE WHEN EXISTS(
					select * from dbo.TweetBookmark tb where tb.TweetId = t.Id and tb.UserId = @currentUserId
				) THEN 1 ELSE 0 END AS IsBookmarkedByCurrentUser

				,u.Id as u_Id
				,u.FollowersCount as u_FollowersCount
				,u.FolloweesCount as u_FolloweesCount
				,u.AvatarUrl as u_AvatarUrl
				,u.Name as u_Name
				,u.About as u_About
				,u.ProfileCoverUrl as u_ProfileCoverUrl

				,originalTweets.Id as ot_Id
				,originalTweets.[CreatedById] as ot_CreatedById
			    ,originalTweets.[CreatedAt] as ot_CreatedAt
			    ,originalTweets.[ImgUrl] as ot_ImgUrl
			    ,originalTweets.[Text] as ot_Text
			    ,originalTweets.[RetweetedFromId] as ot_RetweetedFromId
			    ,originalTweets.[LikeCount] as ot_LikeCount
			    ,originalTweets.[RetweetCount] as ot_RetweetCount
			    ,originalTweets.[BookmarkCount] as ot_BookmarkCount
			    ,originalTweets.[OnlyFollowedCanReply] as ot_OnlyFollowedCanReply
				,CASE WHEN EXISTS(
					select * from dbo.TweetComment tc where tc.TweetId = originalTweets.Id and tc.CreatedById = @currentUserId
				) THEN 1 ELSE 0 END AS ot_IsCommentedByCurrentUser
			    ,CASE WHEN EXISTS(
					select * from dbo.TweetLike tl where tl.TweetId = originalTweets.Id and tl.UserId = @currentUserId
				) THEN 1 ELSE 0 END AS ot_IsLikedByCurrentUser
			    ,CASE WHEN EXISTS(
					select * from dbo.TweetBookmark tb where tb.TweetId = originalTweets.Id and tb.UserId = @currentUserId
				) THEN 1 ELSE 0 END AS ot_IsBookmarkedByCurrentUser

			FROM dbo.Tweet t
			JOIN dbo.AspNetUsers u ON u.Id = t.CreatedById
			JOIN dbo.Tweet originalTweets ON originalTweets.Id = t.RetweetedFromId
			WHERE 1 = 1';

			-- filtering setup
			IF @text IS NOT NULL
			SET @sql = @sql + ' 
			AND t.[Text] LIKE ''%'' + @text + ''%''';
 
			IF @createdById IS NOT NULL
			SET @sql = @sql + ' 
			AND t.[CreatedById] = @createdById';

			IF @onlyWithComments IS NOT NULL AND @onlyWithComments = 1
			SET @sql = @sql + ' 
			AND EXISTS (select tc.Id from dbo.TweetComment tc where tc.TweetId = t.Id)';

			IF @onlyWithMedia IS NOT NULL AND @onlyWithMedia = 1
			SET @sql = @sql + ' 
			AND t.ImgUrl IS NOT NULL';

			IF @onlyLikedByUserId IS NOT NULL
			SET @sql = @sql + ' 
			AND EXISTS (select * from dbo.TweetLike tl where tl.TweetId = t.Id and tl.UserId = @onlyLikedByUserId)';

			IF @followerId IS NOT NULL
			SET @sql = @sql + ' 
			AND EXISTS (select * from dbo.Follow f where f.FolloweeId = t.CreatedById and f.FollowerId = @followerId)';

			-- sorting setup
			set @orderBy = ' 
			ORDER BY ' + @sortProp + ' ' + @sortDirection;
			SET @sql = @sql + @orderBy;

			-- paging setup
			set @paging = ' 
			OFFSET (@pageNumber - 1) * @pageSize ROWS FETCH NEXT @pageSize ROWS ONLY';
			set @sql = @sql + @paging;
 
			print(@sql)

			EXEC sp_Executesql     
					@sql,  
					@params, 
					@text = @text,
					@createdById = @createdById,
					@onlyWithComments = @onlyWithComments,
					@pageNumber = @pageNumber,
					@pageSize = @pageSize,
					@onlyLikedByUserId = @onlyLikedByUserId,
					@onlyWithMedia = @onlyWithMedia,
					@followerId = @followerId,
					@currentUserId = @currentUserId
";
	}
}
