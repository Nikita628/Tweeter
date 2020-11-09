namespace Tweeter.Application.DataBase.SqlQueries
{
	public class User
	{
		public const string SearchUsers = @"
			--DECLARE 
			--@followersOfUserId as int = null,
			--@followeesOfUserId as int = null, 

			--@sortProp as nvarchar(100) = 'id',
			--@sortDirection as nvarchar(100) = 'asc', 

			--@pageNumber AS INT = 1, 
			--@pageSize AS INT = 20

			DECLARE @sql NVARCHAR(MAX);
			DECLARE @params NVARCHAR(500);
			declare @filter nvarchar(1000) = ' where 1=1';
			declare @join nvarchar(1000) = '';
			declare @orderBy nvarchar(500);
			declare @paging nvarchar(500);

			SET @params = '@followeesOfUserId int,
							@followersOfUserId int,
							@pageNumber int,
							@pageSize int';

			SET @sql = 'SELECT u.Id
				,u.FollowersCount
				,u.FolloweesCount
				,u.AvatarUrl
				,u.Name
				,u.About
				,u.ProfileCoverUrl

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
					@pageNumber = @pageNumber,
					@pageSize = @pageSize
";
	}
}
