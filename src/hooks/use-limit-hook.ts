import { limitStorage, tokenStorage, userStorage } from "@/utils/storage"

interface ILimit {
  recordTime: Date;
  todayUsed: number;
}

export const useLimitHook = () => {
  const maxFreeCountDay = 2
  const getLimitData = () => {
    const data = limitStorage.get<ILimit>();
    if (!data) {
      return {
        recordTime: new Date(),
        todayUsed: 0
      }
    }
    return data
  }
  const updateLimitData = (data: ILimit) => {
    limitStorage.set(data);
  }

  // 是否超过每天使用次数2
  const isExceedFreeTimesByDay = () => {
    if (tokenStorage.get() && userStorage.get()) {
      return false;
    }
    const data = getLimitData()
    const { recordTime } = data
    const { start } = getTodayStartAndEnd()
    const record = new Date(recordTime)
    // 如果是缓存的时间小于今天开始，说明今天还没有使用过，更新下
    if (record.valueOf() < start.valueOf()) {
      updateLimitData({
        recordTime: new Date(),
        todayUsed: 0
      })
      return false;
    }
    
    if (data.todayUsed >= maxFreeCountDay) {
      return true
    }
    return false
  }

  const recordTimeUse = () => {
    const data = getLimitData();
    updateLimitData({
      recordTime: new Date(),
      todayUsed: data.todayUsed + 1
    })
  }

  const getTodayStartAndEnd = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const start = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
    const end = new Date(Date.UTC(year, month - 1, day, 23, 59, 59));
    return { start, end };
  }
  return {
    recordTimeUse,
    getTodayStartAndEnd,
    isExceedFreeTimesByDay
  }
}