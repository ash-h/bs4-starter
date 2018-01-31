console.log('ready');
fetch('./js/tree.json').then(r => r.json())
.then(data => {

    const tree = data;
    //console.log(tree);

    const treel1 = tree.children;
    //console.log(treel1.title);

    const lone = document.getElementsByClassName('level__one'[0]);
    [...treel1].forEach(t1 => {
        const a = t1.title;

        if (t1.children != null ) {
            //console.log(t1.children);
            [...t1.children].forEach(child => {
                const b = child.title;

                if (child.children != null && child.linkPart === 'range-rover') {
                    [...child.children].forEach(child3 => {
                        console.log(a +" - " +b  +" - "+child3.title);
                    });
                }
            });
        }
    });

createTree(key) {

    const breadcrumbs = document.getElementsByClassName('nav__breadcrumbs');
    let siteMap = JSON.parse(breadcrumbs[0].getAttribute('data-site-map'));

    [...siteMap.children].forEach(level1 => {
        const a = level1.linkPart;

    let menuPanel = document.createElement('ul');
    menuPanel.setAttribute('class', 'secnavlevel2');


    if (level1.children != null ) {
        [...level1.children].forEach(level1child => {
            const b = level1child.title;
        const z = document.getElementsByTagName('li');

        [...z].forEach(l => {
            if ( l.getAttribute('data-name') === level1child.linkPart) {

            if (level1child.children != null && level1child.linkPart === key) {
                if (!document.querySelector('ol li ul.secnavlevel2')) {
                    l.appendChild(menuPanel);
                }
                [...level1child.children].forEach(child3 => {
                    //const l3trigger = document.querySelectorAll('.level2 li');
                    if(menuPanel.children != null) {
                    menuPanel.innerHTML += `<li class="${child3.linkPart}"><a href="${child3.linkPart}">${child3.title}</a></li>`;
                }
                if (child3.children != null ) {
                    [...child3.children].forEach(child4 => {
                        //console.log(a +" - " +b  +" - "+child3.title + " - " + child4.title);
                    });

                }
            });
            }

        }
    });
    });
    }
});

}


})
.catch(e => console.log(e))

