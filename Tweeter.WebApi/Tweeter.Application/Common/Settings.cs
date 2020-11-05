namespace Tweeter.Application.Common
{
	public class AppSettings
	{
		public string TokenSecret { get; set; }
		public string ClientApiUrl { get; set; }
	}

	public class CloudinarySettings
	{
		public string CloudName { get; set; }
		public string ApiKey { get; set; }
		public string ApiSecret { get; set; }
	}
}
