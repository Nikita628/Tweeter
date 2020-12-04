using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Tweeter.Application.Migrations
{
    public partial class AddedTweetBookmarkFieldCreatedAt : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "TweetBookmark",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "TweetBookmark");
        }
    }
}
