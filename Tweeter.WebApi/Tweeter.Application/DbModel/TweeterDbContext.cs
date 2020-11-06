using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Tweeter.Application.DbModel
{
	public class TweeterDbContext : IdentityDbContext<User, IdentityRole<int>, int>
	{
		#region PM console requires
		public TweeterDbContext()
		{

		}

		protected override void OnConfiguring(DbContextOptionsBuilder options)
		{
			if (!options.IsConfigured)
			{
				options.UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=Tweeter;Trusted_Connection=True;");
			}
		}
		#endregion

		public TweeterDbContext(DbContextOptions<TweeterDbContext> options)
			: base(options)
		{
		}

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);

			// Follow ---
			modelBuilder.Entity<Follow>()
				.HasKey(f => new { f.FollowerId, f.FolloweeId });
			modelBuilder.Entity<Follow>()
				.HasOne(f => f.Follower)
				.WithMany(f => f.Followers)
				.HasForeignKey(f => f.FolloweeId)
				.OnDelete(DeleteBehavior.Restrict);
			modelBuilder.Entity<Follow>()
				.HasOne(f => f.Followee)
				.WithMany(f => f.Followees)
				.HasForeignKey(f => f.FollowerId)
				.OnDelete(DeleteBehavior.Restrict);

			// Tweet ---
			modelBuilder.Entity<Tweet>()
				.HasOne(t => t.RetweetedFrom)
				.WithMany(t => t.Retweets)
				.HasForeignKey(t => t.RetweetedFromId)
				.OnDelete(DeleteBehavior.Restrict);
			modelBuilder.Entity<Tweet>()
				.Property(t => t.Text).IsRequired().HasMaxLength(1000);
			modelBuilder.Entity<Tweet>()
				.HasIndex(t => t.Text);

			// HashTag ---
			modelBuilder.Entity<HashTag>()
				.HasKey(h => h.Text);
			modelBuilder.Entity<HashTag>()
				.Property(h => h.Text).IsRequired().HasMaxLength(300);

			// TweetBookmark ---
			modelBuilder.Entity<TweetBookmark>()
				.HasKey(tb => new { tb.UserId, tb.TweetId });
			modelBuilder.Entity<TweetBookmark>()
				.HasOne(b => b.User)
				.WithMany(u => u.TweetBookmarks)
				.HasForeignKey(b => b.UserId)
				.OnDelete(DeleteBehavior.Restrict);

			// TweetLike ---
			modelBuilder.Entity<TweetLike>()
				.HasKey(tl => new { tl.UserId, tl.TweetId });
			modelBuilder.Entity<TweetLike>()
				.HasOne(tc => tc.User)
				.WithMany(u => u.TweetLikes)
				.HasForeignKey(b => b.UserId)
				.OnDelete(DeleteBehavior.Restrict);

			// TweetCommentLike ---
			modelBuilder.Entity<TweetCommentLike>()
				.HasKey(tcl => new { tcl.UserId, tcl.TweetCommentId });
			modelBuilder.Entity<TweetCommentLike>()
				.HasOne(tc => tc.User)
				.WithMany(u => u.TweetCommentLikes)
				.HasForeignKey(b => b.UserId)
				.OnDelete(DeleteBehavior.Restrict);

			// User ---
			modelBuilder.Entity<User>()
				.Property(u => u.Name).IsRequired().HasMaxLength(300);

			// TweetComment ---
			modelBuilder.Entity<TweetComment>()
				.Property(tc => tc.Text).IsRequired().HasMaxLength(1000);
			modelBuilder.Entity<TweetComment>()
				.HasOne(tc => tc.Tweet)
				.WithMany(u => u.TweetComments)
				.HasForeignKey(b => b.TweetId)
				.OnDelete(DeleteBehavior.Restrict);
		}

		public DbSet<User> User { get; set; }
		public DbSet<Follow> Follow { get; set; }
		public DbSet<HashTag> HashTag { get; set; }
		public DbSet<Tweet> Tweet { get; set; }
		public DbSet<TweetBookmark> TweetBookmark { get; set; }
		public DbSet<TweetComment> TweetComment { get; set; }
		public DbSet<TweetCommentLike> TweetCommentLike { get; set; }
		public DbSet<TweetLike> TweetLike { get; set; }
	}
}
