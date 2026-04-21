using Microsoft.Data.SqlClient;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(opt => opt.AddDefaultPolicy(p => p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));
var app = builder.Build();
app.UseCors();

string cs = builder.Configuration.GetConnectionString("StudentDb")!;

record StudentIn(string fullName, string email, DateTime dob, string department, string phone);

app.MapPost("/api/students", async (StudentIn s) =>
{
    const string sql = @"
      INSERT INTO Students (FullName, Email, DOB, Department, Phone)
      VALUES (@FullName, @Email, @DOB, @Department, @Phone);
      SELECT SCOPE_IDENTITY();
    ";

    await using var con = new SqlConnection(cs);
    await con.OpenAsync();

    await using var cmd = new SqlCommand(sql, con);
    cmd.Parameters.AddWithValue("@FullName", s.fullName);
    cmd.Parameters.AddWithValue("@Email", s.email);
    cmd.Parameters.AddWithValue("@DOB", s.dob.Date);
    cmd.Parameters.AddWithValue("@Department", s.department);
    cmd.Parameters.AddWithValue("@Phone", s.phone);

    var id = await cmd.ExecuteScalarAsync();
    return Results.Ok(new { studentID = Convert.ToInt32(id) });
});

app.MapGet("/api/students", async () =>
{
    const string sql = @"SELECT StudentID, FullName, Email, DOB, Department, Phone FROM Students ORDER BY StudentID DESC;";
    var list = new List<object>();

    await using var con = new SqlConnection(cs);
    await con.OpenAsync();
    await using var cmd = new SqlCommand(sql, con);
    await using var rdr = await cmd.ExecuteReaderAsync();

    while (await rdr.ReadAsync())
    {
        list.Add(new
        {
            studentID = rdr.GetInt32(0),
            fullName = rdr.GetString(1),
            email = rdr.GetString(2),
            dob = rdr.GetDateTime(3),
            department = rdr.GetString(4),
            phone = rdr.GetString(5)
        });
    }

    return Results.Ok(list);
});

app.Run();
