namespace Service.LMSApi.Utils
{

    public enum Role
    {
        Employee = 1,
        Manager = 2,
        Admin = 3
    }


    public enum LeaveTypeEnum
    {
        MaternityLeave = 1,
        PaidLeave = 2,
        CasualLeave = 3,
        SickLeave = 4
    }

    public enum RequestStatus
    {
        Rejected = 1,
        Approved = 2,
        Pending = 3
    }
}
