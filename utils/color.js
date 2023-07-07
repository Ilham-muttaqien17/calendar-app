function getRandomColor(selected = []) {
    const colors = [
        'pink',
        'orangered',
        'purple',
        'darkturquoise',
        'orange',
        'mediumvioletred',
    ];

    if (selected.length > 0) {
        selected.map((e) => {
            colors.indexOf(e) !== -1 && colors.splice(colors.indexOf(e), 1);
        });
    }

    let result = Math.floor(Math.random() * colors.length);

    return colors[result];
}

export { getRandomColor };
