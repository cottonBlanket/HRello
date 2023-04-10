using System.Text;
using Dal;
using Dal.Email;
using Dal.Email.Interfaces;
using Dal.Entities;
using Dal.User.Repositories;
using HRelloApi;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Serilog.Context;
using Serilog.Events;
using Dal.Tasks.Repositories;
using Dal.Tasks.Repositories.Interfaces;
using Dal.User.Repositories.Interfaces;
using HRelloApi.Controllers.Public.Auth.Mapping;
using HRelloApi.Controllers.Public.Departament.Mapping;
using Logic.Managers.Departament;
using Logic.Managers.Departament.Interfaces;
using Logic.Managers.Tasks;
using Logic.Managers.Tasks.Interfaces;
using Logic.Managers.Tasks.StatusesTree;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Подключение логгера
builder.Host.UseSerilog((cts, lc) =>
    lc
        .Enrich.WithThreadId()
        .Enrich.FromLogContext()
        // .AuditTo.Sink<SerilogSink>()
        // .Filter.With<SerilogFilter>()
        // .Enrich.With<SerilogEnrich>()
        .WriteTo.Console(
            LogEventLevel.Information,
            outputTemplate:
            "{Timestamp:HH:mm:ss:ms} LEVEL:[{Level}]| THREAD:|{ThreadId}| Source: |{Source}| {Message}{NewLine}{Exception}"));

LogContext.PushProperty("Source", "Program");

// Настройки аутентификации через JwtBearer
builder.Services.AddAuthentication(options =>
    {
        options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.SaveToken = true;
        options.RequireHttpsMetadata = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidAudience = builder.Configuration["JWTSettings:Audience"],
            ValidIssuer = builder.Configuration["JWTSettings:Issuer"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWTSettings:SecretKey"]))
        };
    });

// подключение к бд
builder.Services.AddDbContext<DataContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// добавление айдентити, тестовая
// надо усложнить требования к паролю
builder.Services.AddIdentity<UserDal, IdentityRole>(config =>
    {
        config.Password.RequiredLength = 4;
        config.Password.RequireDigit = false;
        config.Password.RequireNonAlphanumeric = false;
        config.Password.RequireUppercase = false;
    })
    .AddEntityFrameworkStores<DataContext>()
    .AddDefaultTokenProviders();

// конфигурация айдентити 
builder.Services.AddIdentityServer()
    .AddAspNetIdentity<UserDal>()
    .AddInMemoryApiResources(IdentityConfiguration.ApiResources)
    .AddInMemoryIdentityResources(IdentityConfiguration.IdentityResources)
    .AddInMemoryApiScopes(IdentityConfiguration.ApiScopes)
    .AddInMemoryClients(IdentityConfiguration.Clients)
    .AddDeveloperSigningCredential();

// TODO delete?
// builder.Services.ConfigureApplicationCookie(config =>
// {
//     config.Cookie.Name = "Notes.Identity.Cookie";
//     config.LoginPath = "/Auth/Login";
//     config.LogoutPath = "/Auth/Logout";
// });
// Add services to the container.

builder.Services.AddControllers();

// Тестовые репозиторий для бд почты. Требует удаления
builder.Services.AddScoped<IEmailRepository, EmailRepository>();
// Репозиторий пользователя
builder.Services.AddScoped<UserRepository>();
// Мененджер пользователя
builder.Services.AddScoped<UserManager<UserDal>>();
// ???
//builder.Services.AddScoped(typeof(Logic.Managers.UserManager<>));
// Мэненджер ролей из идентити
builder.Services.AddScoped<RoleManager<IdentityRole>>();
// работа с отдеклами
builder.Services.AddScoped<IDepartamentManager, DepartamentManager>();
builder.Services.AddScoped<IDepartamentRepository, DepartamentRepository>();
//работа с задачами
builder.Services.AddScoped<ITaskRepository, TaskRepository>();
//builder.Services.AddScoped<ITaskStatusManager, StatusManager>();
//builder.Services.AddScoped<ITaskManager, TaskManager>();
builder.Services.AddSingleton<StatusTree>();
builder.Services.AddScoped<ITaskUnitOfWorkManager, TaskUnitOfWorkManager>();
builder.Services.AddScoped<IHistoryRepository, HistoryRepository>();
builder.Services.AddScoped<IBossTaskResultsRepository, BossTaskResultsRepository>();
builder.Services.AddScoped<IUserTaskResultsRepository, UserTaskResultsRepository>();
// Маппинг 
builder.Services.AddAutoMapper(typeof(AccountMappingProfile));
builder.Services.AddAutoMapper(typeof(CreateUserMappingProfile));
builder.Services.AddAutoMapper(typeof(DepartamentProfiles));

// Add cors
builder.Services.AddCors(options => options.AddDefaultPolicy(
    policy =>
    {
        policy.WithOrigins("http://185.133.40.145:3033",
                "http://185.133.40.145:7296")
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    }));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    var basePath = AppContext.BaseDirectory;

    var xmlPath = Path.Combine(basePath, "Api.xml");
    options.IncludeXmlComments(xmlPath);
    // Авторизация через сваггер
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "JWT Authorization header using the Bearer scheme."
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement()
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header,

            },
            new List<string>()
        }
    });
});

var clientPath = Path.Join(Directory.GetCurrentDirectory(), "..", "..", "ussc_frontend", "build");

// ИСПОЛЬЗУЕМ SPA
// Ебучее говно!

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseHttpsRedirection();

// Подключаем авторизацию, аутентификацию и айдентити
app.UseAuthentication();
app.UseAuthorization();
app.UseIdentityServer();

// Откючаем (комментируем) если не требуется отчистка бд 
// т.к. все данные из бд будут удаленны
/*#if DEBUG


using (var scope = 
       app.Services.CreateScope())
using (var context = scope.ServiceProvider.GetService<DataContext>())
{
    context.Database.EnsureDeleted();
    context.Database.EnsureCreated();
}
#endif   */     
        

app.MapControllers();

app.Run();