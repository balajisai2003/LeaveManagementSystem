using Microsoft.Data.SqlClient;
using Service.LMSApi.Models;
using Service.LMSApi.Models.Domains;
using Service.LMSApi.Services.IServices;
using Service.LMSApi.Utils;

namespace Service.LMSApi.Services
{
    public class EmployeeServices : IEmployeeServices
    {
        private readonly string _connectionString;
        private readonly ITokenGenerator _tokenGenerator;

        public EmployeeServices(ITokenGenerator tokenGenerator)
        {
            _connectionString = "Data Source=DESKTOP-ND6SQ79\\SQLEXPRESS;Initial Catalog=LMSPortal;Integrated Security=True;Connect Timeout=30;Encrypt=True;TrustServerCertificate=True";
            _tokenGenerator = tokenGenerator;
        }

        public async Task<ResponseDTO> RegisterAsync(EmpRequestDTO request)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();

                using (SqlCommand sqlCommand = new SqlCommand())
                {
                    sqlCommand.Connection = conn;

                    // Check if the email already exists in the database
                    string checkEmailSql = "SELECT COUNT(1) FROM Employee WHERE Email = @Email";
                    sqlCommand.CommandText = checkEmailSql;
                    sqlCommand.Parameters.AddWithValue("@Email", request.Email);

                    int emailCount = Convert.ToInt32(await sqlCommand.ExecuteScalarAsync());

                    if (emailCount > 0)
                    {
                        return new ResponseDTO
                        {
                            isSuccess = false,
                            message = "Email is already in use."
                        };
                    }


                    
                    // Proceed to insert the new employee if the email does not exist
                    string insertSql = "INSERT INTO Employee (Name, Email, ManagerId, Role, Password) " +
                                       "VALUES (@Name, @Email, @ManagerId, @Role, @Password)";
                    sqlCommand.CommandText = insertSql;

                    sqlCommand.Parameters.Clear(); // Clear existing parameters before adding new ones
                    sqlCommand.Parameters.AddWithValue("@Name", request.Name);
                    sqlCommand.Parameters.AddWithValue("@Email", request.Email);
                    sqlCommand.Parameters.AddWithValue("@ManagerId", request.ManagerId as object ?? DBNull.Value);
                    sqlCommand.Parameters.AddWithValue("@Role", "Employee");
                    sqlCommand.Parameters.AddWithValue("@Password", request.Password); // Ensure to hash this in production

                    int rowsAffected = await sqlCommand.ExecuteNonQueryAsync();

                    if (rowsAffected > 0)
                    {
                        sqlCommand.CommandText = "SELECT @@IDENTITY"; // Get the last inserted ID
                        int id = Convert.ToInt32(await sqlCommand.ExecuteScalarAsync());

                        return new ResponseDTO
                        {
                            isSuccess = true,
                            message = "Employee registered successfully.",
                            Data = new Employee
                            {
                                Id = id,
                                Name = request.Name,
                                Email = request.Email,
                                ManagerId = request.ManagerId,
                                Role = ((Role)request.Role).ToString()
                            }
                        };
                    }
                    else
                    {
                        return new ResponseDTO
                        {
                            isSuccess = false,
                            message = "Error registering the employee."
                        };
                    }
                }
            }
        }


        public async Task<LoginResponseDTO> LoginAsync(LoginRequestDTO request)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();

                using (SqlCommand sqlCommand = new SqlCommand())
                {
                    sqlCommand.Connection = conn;

                    string sql = "SELECT * FROM Employee WHERE Email = @Email AND Password = @Password";
                    sqlCommand.CommandText = sql;

                    sqlCommand.Parameters.AddWithValue("@Email", request.Email);
                    sqlCommand.Parameters.AddWithValue("@Password", request.Password); // Hash in production

                    using (SqlDataReader reader = await sqlCommand.ExecuteReaderAsync())
                    {
                        if (reader.HasRows)
                        {
                            reader.Read(); // Read the first record

                            var employee = new Employee
                            {
                                Id = reader.GetInt32(reader.GetOrdinal("Id")),
                                Name = reader.GetString(reader.GetOrdinal("Name")),
                                Email = reader.GetString(reader.GetOrdinal("Email")),
                                ManagerId = reader.IsDBNull(reader.GetOrdinal("ManagerId")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("ManagerId")),
                                Role = reader.GetString(reader.GetOrdinal("Role")),
                                Password = reader.GetString(reader.GetOrdinal("Password"))
                            };

                            // Generate a JWT token
                            string token = _tokenGenerator.GenerateToken(employee, employee.Role);

                            

                            return new LoginResponseDTO
                            {
                                employee = employee,
                                Token = token,
                                isSuccess = false,
                                message = "Login Successful"
                            };
                        }
                        else
                        {
                            return new LoginResponseDTO
                            {
                                isSuccess = false,
                                message = "Invalid credentials."
                            };
                        }
                    }
                }
            }
        }

        public async Task<ResponseDTO> UpdateAsync(int id, EmpRequestDTO request)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();

                using (SqlCommand sqlCommand = new SqlCommand())
                {
                    sqlCommand.Connection = conn;

                    string sql = "UPDATE Employee SET Name = @Name, Email = @Email, ManagerId = @ManagerId, Role = @Role, Password = @Password WHERE Id = @Id";
                    sqlCommand.CommandText = sql;

                    sqlCommand.Parameters.AddWithValue("@Id", id);
                    sqlCommand.Parameters.AddWithValue("@Name", request.Name);
                    sqlCommand.Parameters.AddWithValue("@Email", request.Email);
                    sqlCommand.Parameters.AddWithValue("@ManagerId", (object)request.ManagerId ?? DBNull.Value);
                    sqlCommand.Parameters.AddWithValue("@Role", MapRoleFromInt(request.Role));
                    sqlCommand.Parameters.AddWithValue("@Password", request.Password); // Hash in production

                    int rowsAffected = await sqlCommand.ExecuteNonQueryAsync();

                    if (rowsAffected > 0)
                    {
                        return new ResponseDTO
                        {
                            isSuccess = true,
                            message = "Employee updated successfully."
                        };
                    }
                    else
                    {
                        return new ResponseDTO
                        {
                            isSuccess = false,
                            message = "Error updating the employee."
                        };
                    }
                }
            }
        }

        public async Task<ResponseDTO> DeleteAsync(int id)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();

                using (SqlCommand sqlCommand = new SqlCommand())
                {
                    sqlCommand.Connection = conn;

                    string sql = "DELETE FROM Employee WHERE Id = @Id";
                    sqlCommand.CommandText = sql;

                    sqlCommand.Parameters.AddWithValue("@Id", id);

                    int rowsAffected = await sqlCommand.ExecuteNonQueryAsync();

                    if (rowsAffected > 0)
                    {
                        return new ResponseDTO
                        {
                            isSuccess = true,
                            message = "Employee deleted successfully."
                        };
                    }
                    else
                    {
                        return new ResponseDTO
                        {
                            isSuccess = false,
                            message = "Error deleting the employee."
                        };
                    }
                }
            }
        }

        public async Task<ResponseDTO> GetEmployeeByIdAsync(int id)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();

                using (SqlCommand sqlCommand = new SqlCommand())
                {
                    sqlCommand.Connection = conn;

                    string sql = "SELECT * FROM Employee WHERE Id = @Id";
                    sqlCommand.CommandText = sql;

                    sqlCommand.Parameters.AddWithValue("@Id", id);

                    using (SqlDataReader reader = await sqlCommand.ExecuteReaderAsync())
                    {
                        if (reader.HasRows)
                        {
                            reader.Read();

                            var employee = new Employee
                            {
                                Id = reader.GetInt32(reader.GetOrdinal("Id")),
                                Name = reader.GetString(reader.GetOrdinal("Name")),
                                Email = reader.GetString(reader.GetOrdinal("Email")),
                                ManagerId = reader.IsDBNull(reader.GetOrdinal("ManagerId")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("ManagerId")),
                                Role = reader.GetString(reader.GetOrdinal("Role")),
                                Password = reader.GetString(reader.GetOrdinal("Password"))
                            };

                            return new ResponseDTO
                            {
                                Data = employee,
                                isSuccess = true,
                                message = "Employee found."
                            };
                        }
                        else
                        {
                            return new ResponseDTO
                            {
                                isSuccess = false,
                                message = "Employee not found."
                            };
                        }
                    }
                }
            }
        }

        public async Task<ResponseDTO> GetAllEmployeesAsync()
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();

                using (SqlCommand sqlCommand = new SqlCommand())
                {
                    sqlCommand.Connection = conn;

                    string sql = "SELECT * FROM Employee";
                    sqlCommand.CommandText = sql;

                    using (SqlDataReader reader = await sqlCommand.ExecuteReaderAsync())
                    {
                        var employees = new List<Employee>();

                        while (reader.Read())
                        {
                            var employee = new Employee
                            {
                                Id = reader.GetInt32(reader.GetOrdinal("Id")),
                                Name = reader.GetString(reader.GetOrdinal("Name")),
                                Email = reader.GetString(reader.GetOrdinal("Email")),
                                ManagerId = reader.IsDBNull(reader.GetOrdinal("ManagerId")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("ManagerId")),
                                Role = reader.GetString(reader.GetOrdinal("Role")),
                                Password = reader.GetString(reader.GetOrdinal("Password"))
                            };
                            employees.Add(employee);
                        }

                        return new ResponseDTO
                        {
                            isSuccess = true,
                            message = "Employees retrieved successfully.",
                            Data = employees // This might need to be adjusted based on your desired output
                        };
                    }
                }
            }
        }

        public async Task<ResponseDTO> GetAllManagersAsync()
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();

                using (SqlCommand sqlCommand = new SqlCommand())
                {
                    sqlCommand.Connection = conn;

                    string sql = "SELECT * FROM Employee WHERE Role = 'Manager'";
                    sqlCommand.CommandText = sql;

                    using (SqlDataReader reader = await sqlCommand.ExecuteReaderAsync())
                    {
                        var managers = new List<Employee>();

                        while (reader.Read())
                        {
                            var manager = new Employee
                            {
                                Id = reader.GetInt32(reader.GetOrdinal("Id")),
                                Name = reader.GetString(reader.GetOrdinal("Name")),
                                Email = reader.GetString(reader.GetOrdinal("Email")),
                                ManagerId = reader.IsDBNull(reader.GetOrdinal("ManagerId")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("ManagerId")),
                                Role = reader.GetString(reader.GetOrdinal("Role")),
                                Password = reader.GetString(reader.GetOrdinal("Password"))
                            };
                            managers.Add(manager);
                        }

                        if (managers.Count > 0)
                        {
                            return new ResponseDTO
                            {
                                Data = managers,
                                isSuccess = true,
                                message = "Managers retrieved successfully."
                            };
                        }
                        else
                        {
                            return new ResponseDTO
                            {
                                isSuccess = false,
                                message = "No managers found.",
                                Data = null
                            };
                        }
                    }
                }
            }
        }

        private string MapRoleFromInt(int role)
        {
            return role switch
            {
                1 => "Employee",
                2 => "Manager",
                3 => "Admin",
                _ => "Employee"
            };
        }
    }
}
