using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Tweeter.Application.Contracts
{
	public interface IRawSqlService
	{
		Task<List<T>> Search<T>(string sql, object param);
		Task<List<TReturn>> Search<TFirst, TSecond, TReturn>(string sql, object param, Func<TFirst, TSecond, TReturn> map, string splitOn);
		Task<List<TReturn>> Search<TFirst, TSecond, TThird, TReturn>(
			string sql,
			object param,
			Func<TFirst, TSecond, TThird, TReturn> map,
			string splitOn
			);
	}
}
