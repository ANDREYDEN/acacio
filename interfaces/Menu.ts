import { ReactElement } from 'react'
import { IconProps } from 'react-iconly'

export interface IRouteProps {
    route: string,
    icon: ReactElement<IconProps>,
    iconFilled: ReactElement<IconProps>,
    subRoutes?: Record<string, string>
}

export type AppRoutesType = Record<string, IRouteProps>

export interface IMenuItem {
    currentItem: IRouteProps,
    currentRoute: string,
    pageName: string
}