namespace Tweeter.Application.DataBase.SqlQueries
{
	public class TweetComment
	{
		public const string SearchCommentsForTweets = @"
			WITH tweetComments AS (
				SELECT *, ROW_NUMBER() 
				over (
					PARTITION BY tc.TweetId
					order by tc.Id
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
			order by tweetComments.TweetId
";
	}
}
