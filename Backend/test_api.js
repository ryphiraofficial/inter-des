import http from 'http';

const data = JSON.stringify({
  status: "Draft",
  items: [
    {
      itemName: "Test Item API",
      unit: "Sq Ft",
      quantity: 1,
      cmL: 120,
      cmH: 120,
      cmD: 50,
      sqft: 16
    }
  ]
});

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/sales/quotations/6a211124832025005f2ca6d3', // using the ID we used before
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log('Response:', body));
});

req.on('error', e => console.error(e));
req.write(data);
req.end();
