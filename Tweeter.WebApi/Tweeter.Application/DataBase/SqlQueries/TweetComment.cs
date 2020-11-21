namespace Tweeter.Application.DataBase.SqlQueries
{
	public class TweetComment
	{
		public const string SearchCommentsForTweets = @"
			;WITH tweetComments AS (
				SELECT *, ROW_NUMBER() 
				over (
					PARTITION BY tc.TweetId
					order by tc.Id desc
				) AS RowNumber
				FROM dbo.TweetComment tc
				where tc.TweetId in @tweetIds
			)
			SELECT tweetComments.[Id]
				  ,[CreatedById]
				  ,[CreatedAt]
				  ,[Text]
				  ,[ImgUrl]
				  ,[TweetId]
				  ,[LikeCount]
				  ,CASE WHEN EXISTS(
						select * from dbo.TweetCommentLike tcl where tcl.TweetCommentId = tweetComments.Id and tcl.UserId = @currentUserId
					) THEN 1 ELSE 0 END AS IsLikedByCurrentUser

				  , 0 as _split_

				  ,u.Id
				  ,u.FollowersCount
				  ,u.FolloweesCount
				  ,u.AvatarUrl
				  ,u.Name
				  ,u.About
				  ,u.ProfileCoverUrl

			FROM tweetComments 
			JOIN dbo.AspNetUsers u ON u.Id = tweetComments.CreatedById
			WHERE RowNumber <= @pageSize 
			order by tweetComments.TweetId;
";

		public const string SearchComments = @"
			--DECLARE 
			--@tweetId as int = 2,
			--@currentUserId as int = null,

			--@sortProp as nvarchar(100) = 'tc.id',
			--@sortDirection as nvarchar(100) = 'asc', 

			--@pageNumber AS INT = 1, 
			--@pageSize AS INT = 100

			DECLARE @sql NVARCHAR(MAX);
			DECLARE @params NVARCHAR(500);
			declare @orderBy nvarchar(500);
			declare @paging nvarchar(500);

			SET @params = '@pageNumber int,
							@pageSize int,
							@tweetId int,
							@currentUserId int,
							@idLessThan int';

			SET @sql = 'SELECT tc.[Id]
				  ,tc.[CreatedById]
				  ,tc.[CreatedAt]
				  ,tc.[Text]
				  ,tc.[ImgUrl]
				  ,tc.[TweetId]
				  ,tc.[LikeCount]
				  ,CASE WHEN EXISTS(
						select * from dbo.TweetCommentLike tcl where tcl.TweetCommentId = tc.Id and tcl.UserId = @currentUserId
					) THEN 1 ELSE 0 END AS IsLikedByCurrentUser
			  
				,0 as _split_
				,u.Id
				,u.FollowersCount
				,u.FolloweesCount
				,u.AvatarUrl
				,u.Name
				,u.About
				,u.ProfileCoverUrl

				,0 as _split_
				,COUNT(*) OVER() TotalCount

			FROM dbo.TweetComment tc
			JOIN dbo.AspNetUsers u ON u.Id = tc.CreatedById
			WHERE 1 = 1';

			-- filtering setup ----------------------------
			IF @tweetId IS NOT NULL
				SET @sql = @sql + ' 
				AND tc.[TweetId] = @tweetId';

			IF @idLessThan IS NOT NULL
				SET @sql = @sql + ' 
				AND tc.[Id] < @idLessThan';

			-- sorting setup ----------------------------
			set @orderBy = ' 
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
					@pageNumber = @pageNumber,
					@pageSize = @pageSize,
					@tweetId = @tweetId,
					@currentUserId = @currentUserId,
					@idLessThan = @idLessThan
";

		public const string GetById = @"
				SELECT tc.[Id]
				  ,tc.[CreatedById]
				  ,tc.[CreatedAt]
				  ,tc.[Text]
				  ,tc.[ImgUrl]
				  ,tc.[TweetId]
				  ,tc.[LikeCount]
			  
				,0 as _split_
				,u.Id
				,u.FollowersCount
				,u.FolloweesCount
				,u.AvatarUrl
				,u.Name
				,u.About
				,u.ProfileCoverUrl

			FROM dbo.TweetComment tc
			JOIN dbo.AspNetUsers u ON u.Id = tc.CreatedById
			WHERE tc.Id = @id;
";
	}
}
