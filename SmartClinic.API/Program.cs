using Microsoft.OpenApi.Models;
using SmartClinic.API.Middlewares;
using SmartClinic.Application;
using SmartClinic.Infrastructure.Extensions;
using SmartClinic.Persistence.Extensions;
using SmartClinic.Persistence.Seed;
using System.Reflection;

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
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });

            builder.Services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo { Title = "SmartClinic API", Version = "v1" });

                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Enter 'Bearer' [space] and then your valid JWT token."
                });

                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        Array.Empty<string>()
                    }
                });
            });

            builder.Services.AddApplication();
            builder.Services.AddPersistence(builder.Configuration);
            builder.Services.AddInfrastructure(builder.Configuration);

            var app = builder.Build();

            // Configure middleware pipeline
            app.UseMiddleware<ExceptionHandlingMiddleware>();

            app.UseCors("AllowAll");

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