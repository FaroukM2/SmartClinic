using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;

namespace SmartClinic.API.Middlewares
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred: {Message}", ex.Message);
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            var statusCode = HttpStatusCode.InternalServerError;
            var response = new ExceptionResponse
            {
                Success = false,
                Message = "An unexpected error occurred."
            };

            switch (exception)
            {
                case ValidationException validationException:
                    statusCode = HttpStatusCode.BadRequest;
                    response.Message = "Validation failed for one or more inputs.";
                    response.Errors = validationException.Errors
                        .GroupBy(e => e.PropertyName, e => e.ErrorMessage)
                        .ToDictionary(failureGroup => failureGroup.Key, failureGroup => failureGroup.ToArray());
                    break;

                case UnauthorizedAccessException:
                    statusCode = HttpStatusCode.Unauthorized;
                    response.Message = exception.Message;
                    break;

                case KeyNotFoundException:
                case InvalidOperationException when exception.Message.Contains("not found", StringComparison.OrdinalIgnoreCase):
                    statusCode = HttpStatusCode.NotFound;
                    response.Message = exception.Message;
                    break;

                case InvalidOperationException:
                    statusCode = HttpStatusCode.BadRequest;
                    response.Message = exception.Message;
                    break;

                default:
                    response.Message = exception.Message;
                    break;
            }

            context.Response.StatusCode = (int)statusCode;
            var jsonResponse = JsonSerializer.Serialize(response, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            return context.Response.WriteAsync(jsonResponse);
        }
    }

    public class ExceptionResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = null!;
        public Dictionary<string, string[]>? Errors { get; set; }
    }
}
