using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Tweeter.Application.Contracts;

namespace Tweeter.Application.DataBase
{
	public class RawSqlService : IRawSqlService
	{
        private readonly IConfiguration _config;
        private readonly string _connectionString;

        public RawSqlService(IConfiguration co)
		{
            _config = co;
            _connectionString = co.GetConnectionString("TweeterDb");
        }

		public async Task<List<T>> Search<T>(string sql, object param, Type[] types, Func<object[], T> map, string splitOn)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                var result = await connection.QueryAsync<T>(sql, types, map, param, splitOn: splitOn);
                return result.ToList();
            }
        }
    }
}
