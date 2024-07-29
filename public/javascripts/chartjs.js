const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Admin Sales & Engineer', 'ERP', 'Estimator', 'Finance & Accounting', 'GTI', 'Logistik', 'MEP', 'Operation', 'PCS', 'PPJM','Purchasing','RPE','Sales','Teknisi Servis','Teknisi TC','Tim Bali'],
        datasets: [{
            label: 'Januri',
            data: [2,
                1,
                5.75,
                2.5,
                2.5,
                5,
                2.545454545,
                2.409090909,
                0,
                3,
                2,
                7.428571429,
                5.5,
                2.75,
                7.8,
                0.5
                ],
            borderWidth: 1
        },
        {
            label: 'Februari',
            data: [
                2.111111111,
                3.333333333,
                6.5,
                0.833333333,
                1.25,
                3.571428571,
                3.227272727,
                1.954545455,
                0,
                2.583333333,
                3,
                7.285714286,
                5.875,
                2.5,
                8.6,
                0

            ],
            borderWidth: 1
        },
        {
            label: 'Maret',
            data: [                
                2.666666667,
                6,
                8.5,
                2.916666667,
                2.25,
                6,
                2.909090909,
                2.863636364,
                0,
                4.083333333,
                5.666666667,
                7.714285714,
                6.625,
                3.5,
                5.4,
                0

            ],

            borderWidth: 1
        },
        {
            label: 'April',
            data: [                            
                1.333333333,
                3,
                3.5,
                1,
                1.25,
                3,
                1.681818182,
                1.045454545,
                0,
                2.916666667,
                2.5,
                7.571428571,
                6,
                2.75,
                3.8,
                0

            ],

            borderWidth: 1
        },
        {
            label: 'Mei',
            data: [                            
                2.555555556,
                2.333333333,
                5.5,
                1.307692308,
                1.75,
                1.285714286,
                1.692307692,
                0.863636364,
                0,
                2.333333333,
                1.5,
                7.142857143,
                5.555555556,
                1.4,
                0.6,
                0
                

            ],
            
            
            borderWidth: 1
        },
        {
            label: 'Juni',
            data: [                            
                1.7,
                3.666666667,
                7.25,
                2,
                3.5,
                3.571428571,
                2,
                1.590909091,
                0,
                2.75,
                3.833333333,
                7.875,
                4.1,
                2.4,
                2.6,
                0

                

            ],
            
            
            borderWidth: 1
        }]
    },
    options: {
        layout: {
            padding: 20
        },
        plugins: {
            colors: {
                forceOverride: true
            }
            // customValue: {
            //   name: 'ROI',
            // }
        },
        scales: {
            x: {
                // stacked: true
            },
            y: {
                beginAtZero: true
            }
        }
    }
    // plugins: [{
    //     id: 'customValue',
    //     afterDraw: (chart, args, opts) => {
    //       const {
    //         ctx,
    //         data: {
    //           datasets
    //         },
    //         _metasets
    //       } = chart;
    
    //       datasets[0].data.forEach((dp, i) => {
    //         let barValue = `${(datasets[1].data[i] + dp) / 2}%`;
    //         const lineHeight = ctx.measureText('M').width;
    //         const textVal = opts.name || 'fill'
    
    //         ctx.textAlign = 'center';
    
    //         ctx.fillText(barValue, _metasets[0].data[i].x, (_metasets[0].data[i].y - lineHeight * 1.5), _metasets[0].data[i].width);
    //         ctx.fillText(textVal, _metasets[0].data[i].x, (_metasets[0].data[i].y - lineHeight * 3), _metasets[0].data[i].width);
    //       });
    //     }
    //   }]
});
