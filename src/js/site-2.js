fetch('./js/tree.json').then(r => r.json())
.then(data => {

    const siteMap = data.children;
    //console.log(siteMap);
    const f = [];
    const level2items = [];
    const level3items = [];
    const level4items = [];
        [...siteMap].forEach(root=> {
        if (root.children !== undefined && root.linkPart === 'vehicles') {

            [...root.children].forEach(levelTwoItem => {
                if (levelTwoItem.children !== undefined && levelTwoItem.linkPart === 'range-rover-sport') {
                    level2items.push(levelTwoItem.children);

                    [...level2items[0]].forEach(levelThreeItem => {
                        if (levelThreeItem.children !== undefined) {
                            level3items.push(levelThreeItem.children);

                            [...level3items].forEach(levelFourItem => {
                                if (levelFourItem.children !== undefined) {
                                    level4items.push(levelFourItem.children);
                                }
                            });
                        }
                    });
                }
            });

            f.push(root.children);
            console.log(level2items);
            console.log(level3items);
            console.log(level4items);

        }
    });


    const lone = document.getElementsByClassName('level__one')[0];

    const tree = siteMap.filter( x => {
       if (x.linkPart === 'vehicles') {
           return x;
       }
    });

    const parent = tree[0].children.filter( x => {
        if (x.linkPart === 'range-rover') {
            return x;
        }
    });

    const child = parent[0].children.filter( x => {
        if (x.children !== undefined) {
            return x;
        }
    });

    console.log(child);
    function parseNodes(nodes) { // creates <ul>
        let ul = document.createElement("UL");
        for(let x in nodes) {
            ul.appendChild(parseNode(nodes[x]));
        }
        return ul;
    }

    function parseNode(node) { // creates <li>
        let li = document.createElement("LI");
        li.innerHTML = `<a href="${node.linkPart}">${node.title}</a>`;

        if(node.children) li.appendChild(parseNodes(node.children));
        return li;
    }



    lone.appendChild(parseNodes(siteMap));
    const play = document.getElementsByClassName('target')[0];
    const newel = document.createElement('div');
    newel.className = 'newel';
    newel.innerHTML=`<p>hi there</p>
        <h2>h2222</h2>
        <h3>h3333</h3>
        <ul></ul>
    `;
    play.appendChild(newel);



    const link = document.getElementsByClassName('link')[0];

    const clickHandler = (e)=> {
        e.preventDefault();
        const pat = document.createElement('ul');
        pat.innerHTML =`<li>blah blah blah</li>`;

        const r = newel.childNodes;
        [...r].filter(x => {
            if(x.tagName === 'UL') {
                x.remove();
            }
        });
        newel.appendChild(pat);

    };
    link.addEventListener('click', clickHandler);



    //console.log(level2items);
    lone.appendChild(parseNodes(f[0]));



    const root = document.querySelectorAll('div.level__one > ul > li ');
    const level1 = document.querySelectorAll('div.level__one > ul > li > ul > li');
    const level2 = document.querySelectorAll('div.level__one > ul > li > ul > li > ul > li' );
    const level3 = document.querySelectorAll('div.level__one > ul > li > ul > li > ul > li > ul > li' );


    const gh = (e) => {
        window.location.href='www.google.com';
    };
    level2[0].addEventListener('click', gh);

   function openlevel(list, classname) {

           [...list].forEach(item => {
               //item.parentElement.classList.add(classname);
               const targetUL = item.querySelectorAll('ul')[0];//get target ul

               if (targetUL !== undefined) {
                   targetUL.parentNode.classList.add('more');
               }

               const showul = () => {
                   if (targetUL !== undefined) {
                       targetUL.classList.add('active');
                    }
               };

               const hideul = (e) => {
                   const menu = e.target.querySelectorAll('ul')[0];

                   if ( menu !== undefined && menu.classList.contains('active') === true) {

                       menu.classList.remove('active');
                       menu.parentNode.classList.add('active');
                   }
               };

               item.addEventListener('mouseenter', showul);
               item.addEventListener('mouseleave', hideul);

           });

   }

   openlevel(root, 'root');
   openlevel(level1, 'level1');
   openlevel(level2 , 'level2');
   openlevel(level3, 'level3');


})
.catch(e => console.log(e));





