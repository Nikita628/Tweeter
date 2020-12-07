using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Tweeter.Application.DataBase;

namespace Tweeter.WebApi
{
	public class Program
	{
		public static void Main(string[] args)
		{
			var host = CreateHostBuilder(args).Build();

			CreateDbIfNotExists(host);

			host.Run();
		}

		public static IHostBuilder CreateHostBuilder(string[] args) =>
			Host.CreateDefaultBuilder(args)
				.ConfigureWebHostDefaults(webBuilder =>
				{
					webBuilder.UseStartup<Startup>();
				});

		#region seedDb
		private static void CreateDbIfNotExists(IHost host)
		{
			using (var scope = host.Services.CreateScope())
			{
				var services = scope.ServiceProvider;

				try
				{
					var context = services.GetRequiredService<TweeterDbContext>();
					var userManager = services.GetRequiredService<UserManager<User>>();
					context.Database.Migrate();

					if (!context.User.Any())
					{
						SeedDb(context, userManager);
					}
				}
				catch (Exception ex)
				{
					var logger = services.GetRequiredService<ILogger<Program>>();
					logger.LogError(ex, "An error occurred creating the DB.");
				}
			}
		}


		class SeedData
		{
			public List<User> Users { get; set; }
			public List<Tweet> Tweets { get; set; }
			public List<TweetComment> TweetComments { get; set; }
			public List<HashTag> HashTags { get; set; }
		}

		private static void SeedDb(TweeterDbContext context, UserManager<User> userManager)
		{
			var rand = new Random();
			string fullPath = System.Reflection.Assembly.GetAssembly(typeof(Program)).Location;
			string theDirectory = Path.GetDirectoryName(fullPath);
			string filePath = Path.Combine(theDirectory, "Files", "DbSeedingData.json");
			var seedDataText = System.IO.File.ReadAllText(filePath);
			var seedData = JsonConvert.DeserializeObject<SeedData>(seedDataText);

			// seed users ---
			foreach (var u in seedData.Users)
			{
				var r = userManager.CreateAsync(u, "password").Result;
			}
			context.SaveChanges();

			// seed follows ---
			var followList = new List<Follow>();
			while (followList.Count < 30)
			{
				var f = new Follow
				{
					FolloweeId = seedData.Users[rand.Next(seedData.Users.Count)].Id,
					FollowerId = seedData.Users[rand.Next(seedData.Users.Count)].Id
				};
				if (!followList.Any(tl => tl.FollowerId == f.FollowerId && tl.FolloweeId == f.FolloweeId)
					&& f.FollowerId != f.FolloweeId)
				{
					followList.Add(f);
				}
			}
			context.Follow.AddRange(followList);
			context.SaveChanges();

			// seed tweets ---
			foreach (var b in seedData.Tweets)
			{
				b.CreatedById = seedData.Users[rand.Next(seedData.Users.Count)].Id;
				b.CreatedAt = DateTime.UtcNow.AddMinutes(rand.Next(60));
				context.Tweet.Add(b);
			}
			context.SaveChanges();

			// retweets
			for (int i = 0; i < 20; i++)
			{
				// retweet is merely a reference to an original tweet, almost all fields are empty
				seedData.Tweets[i].ImgUrl = null;
				seedData.Tweets[i].Text = string.Empty;
				seedData.Tweets[i].LikeCount = 0;
				seedData.Tweets[i].BookmarkCount = 0;
				seedData.Tweets[i].RetweetCount = 0;
				seedData.Tweets[i].OnlyFollowedCanReply = false;
				seedData.Tweets[i].RetweetedFromId = seedData.Tweets[seedData.Tweets.Count - 1].Id;
			}
			context.SaveChanges();

			// tweet likes ---
			var tweetLikes = new List<TweetLike>();
			while (tweetLikes.Count < 30)
			{
				var tweetToLike = seedData.Tweets[rand.Next(seedData.Tweets.Count)];
				var newTl = new TweetLike
				{
					UserId = seedData.Users[rand.Next(seedData.Users.Count)].Id,
					TweetId = tweetToLike.Id
				};
				if (!tweetLikes.Any(tl => tl.UserId == newTl.UserId && tl.TweetId == newTl.TweetId)
					&& !tweetToLike.RetweetedFromId.HasValue)
				{
					// can like only original tweet, not a retweet
					tweetLikes.Add(newTl);
				}
			}
			context.TweetLike.AddRange(tweetLikes);
			context.SaveChanges();

			// tweet bookmarks ---
			var tweetBookmarks = new List<TweetBookmark>();
			while (tweetBookmarks.Count < 30)
			{
				var bookmarkDate = DateTime.UtcNow;
				bookmarkDate = bookmarkDate.AddMinutes(rand.Next(10));
				var tweetToBookmark = seedData.Tweets[rand.Next(seedData.Tweets.Count)];
				var newTb = new TweetBookmark
				{
					UserId = seedData.Users[rand.Next(seedData.Users.Count)].Id,
					TweetId = tweetToBookmark.Id,
					CreatedAt = bookmarkDate
				};
				if (!tweetBookmarks.Any(tl => tl.UserId == newTb.UserId && tl.TweetId == newTb.TweetId)
					&& !tweetToBookmark.RetweetedFromId.HasValue)
				{
					// can bookmark only original tweet, not a retweet
					tweetBookmarks.Add(newTb);
				}
			}
			context.TweetBookmark.AddRange(tweetBookmarks);
			context.SaveChanges();

			// seed tweetComments ---
			foreach (var tc in seedData.TweetComments)
			{
				tc.CreatedById = seedData.Users[rand.Next(seedData.Users.Count)].Id;
				tc.CreatedAt = DateTime.UtcNow.AddMinutes(rand.Next(60));
				var tweetToComment = seedData.Tweets[rand.Next(seedData.Tweets.Count)];

				while (tweetToComment.RetweetedFromId.HasValue)
                {
					// can comment only original tweets, not retweets
					tweetToComment = seedData.Tweets[rand.Next(seedData.Tweets.Count)];
				}

				tweetToComment.CommentCount++;
				tc.TweetId = tweetToComment.Id;
				context.TweetComment.Add(tc);
			}
			context.SaveChanges();

			// comment likes ---
			var commentLikes = new List<TweetCommentLike>();
			while (commentLikes.Count < 30)
			{
				var newTb = new TweetCommentLike
				{
					UserId = seedData.Users[rand.Next(seedData.Users.Count)].Id,
					TweetCommentId = seedData.TweetComments[rand.Next(seedData.TweetComments.Count)].Id
				};
				if (!commentLikes.Any(tl => tl.UserId == newTb.UserId && tl.TweetCommentId == newTb.TweetCommentId))
				{
					commentLikes.Add(newTb);
				}
			}
			context.TweetCommentLike.AddRange(commentLikes);
			context.SaveChanges();

			// seed hashTags ---
			foreach (var c in seedData.HashTags)
			{
				context.HashTag.Add(c);
			}
			context.SaveChanges();
		}
		#endregion
	}
}
