export class PortalApp {
    areas: PortalArea[] = [];

    public addArea(area: PortalArea, sections: AreaSection[]) {
        this.areas.push(area);

        area.sections = sections;
        area.entrySection = sections.length > 0 ? sections[0] : null;

        for (const menuItem of sections) {
            menuItem.route = `${area.areaRoute}/${menuItem.route}`;
        }
    }
}

export class PortalArea {
    entrySection: AreaSection;
    sections: AreaSection[] = [];

    constructor(
        public areaName: string,
        public areaRoute: string,
        public areaIcon: string
    ) {

    }
}

export class AreaSection {
    constructor(
        public title: string,
        public route: string,
        public icon: string
    ) {

    }
}
