import React from 'react'
import { Search } from 'react-iconly'

interface ISearchBar {
    searchValue: string
    onValueChange: (value: string) => void
}

const SearchBar: React.FC<ISearchBar> = ({ searchValue, onValueChange }: ISearchBar) => {

    return (
        <div className='flex w-60 border border-grey rounded-lg px-4 py-2'>
            <Search primaryColor='#B2B2B2' />
            <input
                id='search'
                type='text'
                placeholder='Search'
                className='ml-1 w-[180px] px-1 focus:outline-none rounded-lg text-primary-text placeholder-grey'
                value={searchValue}
                onChange={(e) => onValueChange(e.target.value)}
            />
        </div>
    )
}

export default SearchBar