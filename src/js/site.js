


fetch('./js/tree.json').then(r => r.json())
.then(data => {

    const tree = data;
    const siteMap = tree.children;
    const lone = document.getElementsByClassName('level__one')[0];

    function parseNodes(nodes) { // creates <ul>
        let ul = document.createElement("UL");
        for(let x in nodes) {
            ul.appendChild(parseNode(nodes[x]));
        }
        return ul;
    }

    function parseNode(node) { // creates <li>
        let li = document.createElement("LI");
        li.className = node.linkPart;
        li.innerHTML = `<a href="${node.linkPart}">${node.title}</a>`;

        if(node.children) li.appendChild(parseNodes(node.children));
        return li;
    }

    lone.appendChild(parseNodes(siteMap));

    const root = document.querySelectorAll('div.level__one > ul > li ');
    const level1 = document.querySelectorAll('div.level__one > ul > li > ul > li');
    const level2 = document.querySelectorAll('div.level__one > ul > li > ul > li > ul > li' );
    const level3 = document.querySelectorAll('div.level__one > ul > li > ul > li > ul > li > ul > li' );
    const uls = [];

   function openlevel2(list, classname) {


           [...list].forEach(item => {
               item.parentElement.classList.add(classname);
               const o = item.querySelectorAll('ul')[0];//get target ul
               uls.push(o);


               const showul = (e) => {
                   if (item.querySelectorAll('ul')[0] !== undefined) {
                       item.querySelectorAll('ul')[0].classList.add('active');

                    }
               };

               const hideul = (e) => {
                   const d =e.target.querySelectorAll('ul')[0];

                   if ( d !== undefined && d.classList.contains('active') === true) {
                       d.classList.remove('active');
                   }

               };

               item.addEventListener('mouseenter', showul);
               item.addEventListener('mouseleave', hideul);

           });

   }

   openlevel2(root, 'root');
   openlevel2(level1, 'level1');
   openlevel2(level2 , 'level2');
   openlevel2(level3, 'level3');


})
.catch(e => console.log(e));





