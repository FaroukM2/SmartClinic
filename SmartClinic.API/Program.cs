using System.Reflection;
using SmartClinic.Application;
using SmartClinic.Infrastructure.Extensions;
using SmartClinic.Persistence.Extensions;
using SmartClinic.Persistence.Seed;

namespace SmartClinic.API;

public class Program
{
    public static async Task Main(string[] args)
    {
        try
        {
            var builder = WebApplication.CreateBuilder(args);

            // Register services
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddApplication();
            builder.Services.AddPersistence(builder.Configuration);
            builder.Services.AddInfrastructure(builder.Configuration);

            var app = builder.Build();

            // Configure middleware
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            // Seed initial data
            await DbInitializer.SeedAsync(app.Services);

            app.Run();
        }
        catch (Exception ex)
        {
            Console.ForegroundColor = ConsoleColor.Red;

            Console.WriteLine("========== APPLICATION ERROR ==========");
            Console.WriteLine(ex);

            if (ex is ReflectionTypeLoadException reflectionException)
            {
                Console.WriteLine();
                Console.WriteLine("========== LOADER EXCEPTIONS ==========");

                foreach (var loaderException in reflectionException.LoaderExceptions)
                {
                    Console.WriteLine(loaderException?.ToString());
                    Console.WriteLine("----------------------------------------");
                }
            }

            Console.ResetColor();

            Console.WriteLine();
            Console.WriteLine("Press Enter to exit...");
            Console.ReadLine();
        }
    }
}