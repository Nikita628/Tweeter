﻿using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace Tweeter.WebApi.Controllers
{
	public class FallbackController : Controller
	{
		public IActionResult Index()
		{
			return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "index.html"), "text/HTML");
		}
	}
}
