const BASE_URL = "https://servicelmsapibalaji.azurewebsites.net/api/Employee";

const getToken = async () => {
  return localStorage.getItem("token");
};

export async function Login({ email, password }) {
  const request = { email, password };
  try {
    const response = await fetch(`${BASE_URL}/Login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });
    return await handleResponse(response);
  } catch (err) {
    return handleError(err);
  }
}

export async function Register(employeeData) {
  try {
    const response = await fetch(`${BASE_URL}/Register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getToken()}`,
      },
      body: JSON.stringify(employeeData),
    });
    return await handleResponse(response);
  } catch (err) {
    return handleError(err);
  }
}

export async function UpdateEmployee(id, request) {
  try {
    const response = await fetch(`${BASE_URL}/Update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getToken()}`,
      },
      body: JSON.stringify(request),
    });
    return await handleResponse(response);
  } catch (err) {
    return handleError(err);
  }
}

export async function DeleteEmployee(id) {
  try {
    const response = await fetch(`${BASE_URL}/Delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    });
    return await handleResponse(response);
  } catch (err) {
    return handleError(err);
  }
}

export async function GetEmployeeById(id) {
  try {
    const response = await fetch(`${BASE_URL}/GetEmployeeById/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    });
    return await handleResponse(response);
  } catch (err) {
    return handleError(err);
  }
}

export async function GetAllEmployees() {
  try {
    const response = await fetch(`${BASE_URL}/GetAllEmployees`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    });
    return await handleResponse(response);
  } catch (err) {
    return handleError(err);
  }
}

export async function GetAllManagers() {
  try {
    const response = await fetch(`${BASE_URL}/GetAllManagers`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    });
    return await handleResponse(response);
  } catch (err) {
    return handleError(err);
  }
}

// Helper functions to handle responses and errors
async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Something went wrong");
  }
  return await response.json();
}

function handleError(error) {
  console.log(error);
  return {
    isSuccess: false,
    data: null,
    message: error.message,
  };
}
