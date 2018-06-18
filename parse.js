let fs = require('fs');
const argv = require('minimist')(process.argv.slice(2), {string: 'lang'});

function filter(argv) {
  let data = fs.readFileSync('access.log', 'utf8');
    let arr = data.split(' - - ').filter(d => {
      if (d.includes('GET') && d.includes(argv._)) {
        return d;
      } else if (d.includes('GET') && (argv._ == 'other' || argv._ == 'others')) {
        if (!d.includes('iPhone') || !d.includes('Android')) {
          return d;
        }
      }
    }).map(a => {
      let date = a.substring(a.indexOf('[')+1, a.indexOf(']')-12);
      let url = a.split('GET ').pop();
      url = url.substr(0, url.includes('?') ? url.indexOf('?') : url.indexOf(' '));

      return {'date': date, 'url': url} ;
    }).sort((a, b) => {
      return b.date - a.date
    }).reduce((acc, val) => {
      let date = val.date;
      if (!acc.hasOwnProperty(date)) {
        acc[date] = 0;
      }
      acc[date]++
      return acc
    }, {});

    arr = Object.keys(arr).map(k => {
      return [k, argv._, arr[k]]
    });
    arr = {"rows": arr};

    let outCSV = arr.rows.join('\n');
    fs.writeFile('results.csv', outCSV, 'utf8', err => {
      if (err) throw err;
      console.log('results.csv created successfully!')
    })
}

filter(argv)