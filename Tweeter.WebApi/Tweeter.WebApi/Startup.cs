using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Text;
using Tweeter.Application.Common;
using Tweeter.Application.Contracts;
using Tweeter.Application.DbModel;
using Tweeter.Application.Models;
using Tweeter.Application.Services;

namespace Tweeter.WebApi
{
	public class Startup
	{
		public static readonly ILoggerFactory MyLoggerFactory = LoggerFactory.Create(builder => { builder.AddConsole(); });

		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		public IConfiguration Configuration { get; }

		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services)
		{
			services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
				.AddJwtBearer(opt =>
				{
					opt.TokenValidationParameters = new TokenValidationParameters
					{
						ValidateIssuerSigningKey = true,
						IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration.GetSection("AppSettings:TokenSecret").Value)),
						ValidateIssuer = false,
						ValidateAudience = false
					};
				});

			IdentityBuilder ibuilder = services.AddIdentityCore<User>(opt =>
			{
				opt.Password.RequireDigit = false;
				opt.Password.RequiredLength = 5;
				opt.Password.RequireNonAlphanumeric = false;
				opt.Password.RequireUppercase = false;
			});

			ibuilder = new IdentityBuilder(ibuilder.UserType, ibuilder.Services);
			ibuilder.AddEntityFrameworkStores<TweeterDbContext>();
			ibuilder.AddSignInManager<SignInManager<User>>();

			services.AddDbContext<TweeterDbContext>(options => options
				.UseLoggerFactory(MyLoggerFactory)
				.UseSqlServer(Configuration.GetConnectionString("TweeterDb")));

			services.AddCors();
			services.AddControllers();
			services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

			services.Configure<CloudinarySettings>(Configuration.GetSection("CloudinarySettings"));
			services.Configure<AppSettings>(Configuration.GetSection("AppSettings"));

			services.AddScoped<ICloudService, CloudService>();
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			app.UseExceptionHandler(errorApp =>
			{
				errorApp.Run(async context =>
				{
					context.Response.StatusCode = 500;
					context.Response.ContentType = "application/json";

					var exceptionHandlerPathFeature = context.Features.Get<IExceptionHandlerPathFeature>();

					var response = new Response<object>();

					response.Errors.Add(exceptionHandlerPathFeature?.Error.Message);

					context.Response.Headers.Add("Access-Control-Allow-Origin", "*");
					var settings = new JsonSerializerSettings
					{
						ContractResolver = new CamelCasePropertyNamesContractResolver()
					};
					await context.Response.WriteAsync(JsonConvert.SerializeObject(response, settings));
				});
			});

			app.UseCors(opt => opt
			.WithOrigins(Configuration.GetSection("AppSettings:ClientAppUrl").Value)
			.AllowAnyMethod()
			.AllowAnyHeader()
			.AllowCredentials());

			app.UseAuthentication();

			app.UseHttpsRedirection();

			app.UseRouting();

			app.UseAuthorization();

			app.UseEndpoints(endpoints =>
			{
				endpoints.MapControllers();
			});
		}
	}
}
