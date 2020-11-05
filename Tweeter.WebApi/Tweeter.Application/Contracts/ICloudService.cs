using System.Threading.Tasks;
using Tweeter.Application.Models;

namespace Tweeter.Application.Contracts
{
	public interface ICloudService
	{
		Task<CloudUploadResult> UploadAsync(File file);
		Task<Response<string>> DeleteAsync(string publicId);
	}
}
