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