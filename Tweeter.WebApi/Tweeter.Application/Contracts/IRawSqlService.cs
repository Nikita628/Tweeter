using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Tweeter.Application.Contracts
{
	public interface IRawSqlService
	{
		Task<List<T>> Search<T>(string sql, object param, Type[] types, Func<object[], T> map, string splitOn);
	}
}
