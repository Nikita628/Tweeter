using Microsoft.AspNetCore.Http;
using System.IO;
using System.Threading.Tasks;

namespace Tweeter.WebApi.Extensions
{
	public static class File
	{
        public static async Task<byte[]> ToByteArrayAsync(this IFormFile formFile)
        {
            using (var memoryStream = new MemoryStream())
            {
                await formFile.CopyToAsync(memoryStream);
                return memoryStream.ToArray();
            }
        }
    }
}
