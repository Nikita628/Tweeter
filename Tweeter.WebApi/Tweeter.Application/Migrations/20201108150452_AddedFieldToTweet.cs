using Microsoft.EntityFrameworkCore.Migrations;

namespace Tweeter.Application.Migrations
{
    public partial class AddedFieldToTweet : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CommentCount",
                table: "Tweet",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CommentCount",
                table: "Tweet");
        }
    }
}
