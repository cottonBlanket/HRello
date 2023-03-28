﻿using Dal.Tasks.Entities;
using Dal.Tasks.Repositories.Interfaces;
using Logic.Managers.Base;
using Logic.Managers.Task.Interfaces;

namespace Logic.Managers.Task;

public class StatusManager: BaseManager<TaskDal, Guid>, ITaskStatusManager
{
    public StatusManager(ITaskRepository repository) : base(repository)
    {
    }
    
    public async System.Threading.Tasks.Task ChangeStatus(Guid taskId, bool isNext)
    {
        var task = await Repository.GetAsync(taskId);
        if(task == null)
            return;
        task.Status += 1;
        var id = await Repository.UpdateAsync(task);
    }
}