module.exports = {
 
    formatDateTime: function (time) {
        function pad(number) {
            if (number < 10) {
                return '0' + number;
            }
            return number;
        }
        function timezone(time) {
            var hours = pad(Math.abs(Math.floor(time / 60)));
            var minutes = pad(Math.abs(time % 60));
            var sign = time > 0 ? '-' : '+';
            return sign + hours + ':' + minutes;
        }

        return '' + time.getFullYear() +
            '-' + pad(time.getMonth() + 1) +
            '-' + pad(time.getDate()) +
            'T' + pad(time.getHours()) +
            ':' + pad(time.getMinutes()) +
            ':' + pad(time.getSeconds()) +
            '.' + (time.getMilliseconds() / 1000).toFixed(3).slice(2, 5) +
            timezone(time.getTimezoneOffset());
    }

}