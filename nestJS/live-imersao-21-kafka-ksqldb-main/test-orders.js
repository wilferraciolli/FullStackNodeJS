

const sleep = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout));

async function testRequest(){

    const data = new Array(1000).fill(null).map(() => ({
        //id 1 to 1000
        product_id: Math.floor(Math.random() * 1000) + 1,
        price: parseFloat((Math.random() * 100).toFixed(2)),
        quantity: Math.floor(Math.random() * 10) + 1
    }))

    for(const item of data){
        console.log(item);
        await fetch('http://localhost:3000/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        });
        await sleep(1000);
    }
}

testRequest();