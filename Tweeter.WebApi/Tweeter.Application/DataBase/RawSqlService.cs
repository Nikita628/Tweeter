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

		public async Task<List<T>> Search<T>(string sql, object param)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                var result = await connection.QueryAsync<T>(sql, param);
                return result.ToList();
            }
        }

        public async Task<List<TReturn>> Search<TFirst, TSecond, TReturn>(string sql, object param, Func<TFirst, TSecond, TReturn> map, string splitOn)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                var result = await connection.QueryAsync<TFirst, TSecond, TReturn>(sql, map, param, splitOn: splitOn);
                return result.ToList();
            }
        }

        public async Task<List<TReturn>> Search<TFirst, TSecond, TThird, TReturn>(
            string sql, 
            object param, 
            Func<TFirst, TSecond, TThird, TReturn> map, 
            string splitOn
            )
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                var result = await connection.QueryAsync<TFirst, TSecond, TThird, TReturn>(sql, map, param, splitOn: splitOn);
                return result.ToList();
            }
        }
    }
}
