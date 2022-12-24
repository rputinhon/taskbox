import { AbstractDBModel } from "./AbstractDBModel"

const category = {
    name: '',
    description: '',
    parent: '',
    tags: []
}

export const blockLibraryItem = {
    name: '',
    type: '',
    category: { ...category },
    description: '',
    svgIcon: '',
    isactive: false,
    compatiblewith: [],
    noncompatiblewith: [],
    tags: []
}

export const blockLibrary = {
    blocktypes: [blockLibraryItem],
    description: ''
}

const _libraryModel = {
    categoryLibrary: [category],
    blockLibrary: [blockLibrary],
    referencesLibrary: []
}

export const libraryModel = Object.assign(_libraryModel, AbstractDBModel);
