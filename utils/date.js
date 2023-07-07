function getListDay() {
    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    return {
        firstDay,
        lastDay,
    };
}

function getCurrentMonth() {
    let date = new Date();

    return date.toLocaleString('en', { month: 'long' });
}

function getTotalDayCurrentMont() {
    let date = new Date();
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let totalDay = parseInt(
        new Intl.DateTimeFormat('en', { day: 'numeric' }).format(lastDay)
    );

    let currentMontListDay = [];

    for (let i = 1; i <= totalDay; i++) {
        let obj = {};
        obj.type = 'current';
        obj.date = new Date(date.getFullYear(), date.getMonth(), i);
        currentMontListDay.push(obj);
    }

    return currentMontListDay;
}

function getRemainDayPrevMonth() {
    let days = {
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
        Sunday: 7,
    };

    let date = new Date();

    let firstDayCurrMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    let dayName = firstDayCurrMonth.toLocaleString('en', { weekday: 'long' });
    let lastDayPrevMonth = new Date(date.getFullYear(), date.getMonth(), 0);
    let lastDay = parseInt(
        new Intl.DateTimeFormat('en', { day: 'numeric' }).format(
            lastDayPrevMonth
        )
    );

    let totalRestDay = days[dayName] - days['Monday'];

    let remainDayList = [];

    for (let i = lastDay - totalRestDay + 1; i <= lastDay; i++) {
        let obj = {};
        obj.type = 'prev';
        obj.date = new Date(date.getFullYear(), date.getMonth() - 1, i);
        remainDayList.push(obj);
    }
    return remainDayList;
}

function getAvailableDate() {
    let dates = [...getRemainDayPrevMonth(), ...getTotalDayCurrentMont()];
    let date = new Date();

    for (
        let i =
                getRemainDayPrevMonth().length +
                getTotalDayCurrentMont().length,
            j = 1;
        i <= 35;
        i++
    ) {
        let obj = {};
        obj.type = 'next';
        obj.date = new Date(date.getFullYear(), date.getMonth() + 1, j);
        dates.push(obj);
        j++;
    }

    return dates;
}

export {
    getListDay,
    getTotalDayCurrentMont,
    getRemainDayPrevMonth,
    getCurrentMonth,
    getAvailableDate,
};
