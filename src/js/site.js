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
        li.innerHTML = `<a href="${node.linkPart}">${node.title}</a>`;

        if(node.children) li.appendChild(parseNodes(node.children));
        return li;
    }

    lone.appendChild(parseNodes(siteMap));

    const root = document.querySelectorAll('div.level__one > ul > li ');
    const level1 = document.querySelectorAll('div.level__one > ul > li > ul > li');
    const level2 = document.querySelectorAll('div.level__one > ul > li > ul > li > ul > li' );
    const level3 = document.querySelectorAll('div.level__one > ul > li > ul > li > ul > li > ul > li' );

   function openlevel(list, classname) {

           [...list].forEach(item => {
               console.log(item);
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





