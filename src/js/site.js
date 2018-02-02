console.log('ready');
fetch('./js/tree.json').then(r => r.json())
.then(data => {

    const tree = data;
    const siteMap = tree.children;
    const lone = document.getElementsByClassName('level__one')[0];
    const ltwo = document.getElementsByClassName('level__two')[0];

     const root = siteMap.filter(x=> {
        return x;
     });

     const setRoot = root.filter( x=> {
         if(x.linkPart === 'vehicles') { //inject this value;  root
             return x.children;
         }
     });

     const levelThree = setRoot.map(x=> {
         return x.children;
     });



     const rootOption = setRoot[0];
     const l1a = setRoot[0].children[0].children;
     const l2 = setRoot[0].children;
     const l3 = levelThree[0][0].children;

     //const l4 = levelFour[0];
    const levelFour = l3.filter(x=> {
        return x.children;
    });
    const byoption =l2.filter(x=>{
        if (x.linkPart ==='range-rover') {
            return x.children;
        }
    });
    const bo = byoption[0].children;

    const createFullTree = ()=> {
        const lev2 = document.getElementsByTagName('level2')[0];
        [...l2].forEach((e)=> {
            if(e.children !=null) {
                e.children.filter(p=> {
                    lone.innerHTML +=`<ul class="level2"><li>${p.title}</li></ul>`;
                    if (p.children != null) {
                        p.children.filter( g=> {
                            lev2.innerHTML +=`<ul class="level3"><li>${g.title}</li></ul>`;
                        });
                    }

                });
            }
           lone.innerHTML += `<li>${e.title}</li>`
        });
    };

    createFullTree();
    const createList = (e)=> {
        //console.log('j');
        [...l2].forEach(item=> {
            //lone.innerHTML += `<li>${item.title}</li>`;
        });
    };

    const cl2 = ()=> {
        [...bo].forEach(item=> {
            //ltwo.innerHTML += `<li>${item.title}</li>`;
        });
    };

    createList();
    cl2();




     //const l5 = l4[0].children;

     //console.log(levelFour);
     //console.log(levelTwo);
     //console.log(levelThree);
     //console.log(l1a);
     //console.log(rootOption);
     console.log(l2);
     //console.log(bo);
     //console.log(l3);
     //console.log(l4);
     //console.log(l5);





})
.catch(e => console.log(e));




