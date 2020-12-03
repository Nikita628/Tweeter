namespace Tweeter.Application.DataBase.SqlQueries
{
	public class User
	{
		public const string SearchUsers = @"
			--DECLARE 
--			@followersOfUserId as int = null,
--			@followeesOfUserId as int = null, 

--			@idNotEqual as int = null,
--			@nameContains as nvarchar(100) = null,
--			@notFolloweeOfUserId as int = 1,
--			@currentUserId as int = 1,

--			@sortProp as nvarchar(100) = 'id',
--			@sortDirection as nvarchar(100) = 'asc', 

--			@pageNumber AS INT = 1, 
--			@pageSize AS INT = 20

			DECLARE @sql NVARCHAR(MAX);
			DECLARE @params NVARCHAR(500);
			declare @filter nvarchar(1000) = ' where 1=1';
			declare @join nvarchar(1000) = '';
			declare @orderBy nvarchar(500);
			declare @paging nvarchar(500);

			SET @params = '@followeesOfUserId int,
							@followersOfUserId int,
							@idNotEqual int,
							@nameContains nvarchar(100),
							@notFolloweeOfUserId int,
							@currentUserId int,
							@pageNumber int,
							@pageSize int';

			SET @sql = 'SELECT u.Id
				,u.FollowersCount
				,u.FolloweesCount
				,u.AvatarUrl
				,u.Name
				,u.About
				,u.ProfileCoverUrl
				,CASE WHEN EXISTS(
					select top(1) * from dbo.Follow f where f.FollowerId = @currentUserId and f.FolloweeId = u.Id
				) THEN 1 ELSE 0 END AS IsFolloweeOfCurrentUser

				,0 as _split_
				,COUNT(*) OVER() TotalCount

			FROM dbo.AspNetUsers u
			';

			-- filtering setup ----------------------------
			IF @followersOfUserId IS NOT NULL
				SET @filter = @filter + ' 
				AND EXISTS (select top(1) * from dbo.Follow f where f.FollowerId = u.Id and f.FolloweeId = @followersOfUserId)';

			IF @followeesOfUserId IS NOT NULL
				SET @filter = @filter + ' 
				AND EXISTS (select top(1) * from dbo.Follow f where f.FollowerId = @followeesOfUserId and f.FolloweeId = u.Id)';

			IF @idNotEqual IS NOT NULL
				SET @filter = @filter + ' 
				AND u.Id <> @idNotEqual';

			IF @nameContains IS NOT NULL
				SET @filter = @filter + ' 
				AND u.[Name] LIKE ''%'' + ''' + @nameContains + ''' + ''%''';

			IF @notFolloweeOfUserId IS NOT NULL
				SET @filter = @filter + ' 
				AND NOT EXISTS (select top(1) * from dbo.Follow f where f.FollowerId = @notFolloweeOfUserId and f.FolloweeId = u.Id)'

			set @sql = @sql + @filter;

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
					@followersOfUserId = @followersOfUserId,
					@followeesOfUserId = @followeesOfUserId,
					@nameContains = @nameContains,
					@notFolloweeOfUserId = @notFolloweeOfUserId,
					@idNotEqual = @idNotEqual,
					@currentUserId = @currentUserId,
					@pageNumber = @pageNumber,
					@pageSize = @pageSize
";

		public const string GetUser = @"
			--DECLARE 
			--@userId as int = 1,
			--@currentUserId as int = 1;

			DECLARE @sql NVARCHAR(MAX);
			DECLARE @params NVARCHAR(500);
			declare @filter nvarchar(1000) = ' where 1=1';
			declare @join nvarchar(1000) = '';
			declare @orderBy nvarchar(500);
			declare @paging nvarchar(500);

			SET @params = '@userId int,
							@currentUserId int';

			SET @sql = 'SELECT u.Id
				,u.FollowersCount
				,u.FolloweesCount
				,u.AvatarUrl
				,u.Name
				,u.About
				,u.ProfileCoverUrl
				,CASE WHEN EXISTS(
					select top(1) * from dbo.Follow f where f.FollowerId = @currentUserId and f.FolloweeId = u.Id
				) THEN 1 ELSE 0 END AS IsFolloweeOfCurrentUser

			FROM dbo.AspNetUsers u
			';

			-- filtering setup ----------------------------
			IF @userId IS NOT NULL
				SET @filter = @filter + ' 
				AND u.Id = @userId';

			set @sql = @sql + @filter;

			print(@sql)

			EXEC sp_Executesql     
					@sql,  
					@params,
					@userId = @userId,
					@currentUserId = @currentUserId
";
	}
}
