const BASE_URL = "https://servicelmsapibalaji.azurewebsites.net/api/Leave";

const getToken = async () => {
  return localStorage.getItem("token");
};

export async function GetAllLeavesByEmpId(empId) {
  try {
    const response = await fetch(`${BASE_URL}/${empId}`, {
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

export async function GetLeavesAssignedToManager(managerId) {
  try {
    const response = await fetch(`${BASE_URL}/manager/leaves/${managerId}`, {
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

export async function ApplyLeave(leaveRequest) {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getToken()}`,
      },
      body: JSON.stringify(leaveRequest),
    });
    return await handleResponse(response);
  } catch (err) {
    return handleError(err);
  }
}

export async function UpdateLeave(id, leaveRequest) {
  try {
    const response = await fetch(`${BASE_URL}/Update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getToken()}`,
      },
      body: JSON.stringify(leaveRequest),
    });
    return await handleResponse(response);
  } catch (err) {
    return handleError(err);
  }
}

export async function ApproveLeave(leaveId, managerId) {
  try {
    const response = await fetch(
      `${BASE_URL}/manager/approve/${leaveId}/${managerId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      }
    );
    return await handleResponse(response);
  } catch (err) {
    return handleError(err);
  }
}

export async function RejectLeave(leaveId, managerId, RejectReason) {
  try {
    const response = await fetch(
      `${BASE_URL}/manager/reject/${leaveId}/${managerId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getToken()}`,
        },
        body: JSON.stringify(RejectReason),
      }
    );
    return await handleResponse(response);
  } catch (err) {
    return handleError(err);
  }
}

export async function GetLeaveById(leaveId) {
  try {
    const response = await fetch(`${BASE_URL}/details/${leaveId}`, {
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

export async function CancelLeave(leaveId, empId) {
  try {
    const response = await fetch(`${BASE_URL}/cancel/${leaveId}/${empId}`, {
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

async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Something went wrong");
  }
  return await response.json();
}

function handleError(error) {
  console.error(error);
  return {
    isSuccess: false,
    data: null,
    message: error.message,
  };
}
