import axios, { AxiosRequestConfig, Method } from "axios";
import { Route } from "@custom-types/Route";
import { KeyValuePair } from "@custom-types/KeyValuePair";
import { GenericObject } from "@custom-types/GenericObject";
import { BaseItem } from "@custom-types/BaseItem";
import { ApplyType } from "@custom-types/ApplyType";
import { CouponCode } from "@custom-types/CouponCode";
import { GiftCardCode } from "@custom-types/GiftCardCode";
import { CreatorCode } from "@custom-types/CreatorCode";
import { Data } from "@custom-types/Data";
import { Message } from "@custom-types/Message";

/**
 * @constant baseUrl
 * @description The base URL of the Tebex Headless API
 *
 * @type {string}
 */
const baseUrl: string = "https://headless.tebex.io";


/**
 * @function Request
 * @description A function to make a request to the Tebex Headless API
 *
 * @param webstoreIdentifier
 * @param privateKey
 * @param {Method | string} method The method of the request
 * @param identifier
 * @param {Route} route The route of the request
 * @param {string} path The path of the request
 * @param {KeyValuePair<string, GenericObject>} params The parameters of the request
 *
 * @param body
 * @returns {Promise<T>}
 */
export async function Request<T, Body>(
    webstoreIdentifier: string,
    privateKey: string | undefined,
    method: Method,
    identifier: string | null,
    route: Route,
    path?: string,
    params?: KeyValuePair<string, GenericObject>,
    body?: Body
): Promise<T> {
    if (params) {
        for (const [key, value] of Object.entries(params)) {
            if (typeof value === "boolean") {
                params[key] = value ? 1 : 0;
            }
        }
    }

    const config: AxiosRequestConfig = {
        url: `${baseUrl}/api/${route}/${identifier}${path ?? ""}`,
        params: params,
        method: method,
        data: body,
        headers: {
            "Content-Type": "application/json",
        },
    };

    if (webstoreIdentifier && privateKey) {
        config.auth = {
            username: webstoreIdentifier,
            password: privateKey,
        };
    }

    const response = await axios.request<T>(config);

    return response.data;
}

/**
 * @type {Category}
 * @description The category object returned from the Tebex Headless API
 *
 * @param {number} id The ID of the category
 * @param {string} name The name of the category
 * @param {string} description The description of the category
 * @param {Category | null} parent The parent category of the category
 * @param {number} order The order of the category
 * @param {Package[]} packages The packages in the category
 * @param {"grid" | "list" | string} display_type The display type of the category
 * @param {string | null} slug The slug of the category
 */
export type Category = BaseItem & {
    description: string;
    parent: Category | null;
    order: number;
    packages: Package[];
    display_type: "grid" | "list";
    slug: string | null;
};

/**
 * @type {ApplyTypeToInterface}
 * @description The type of the apply request
 *
 * @param {string} coupons The coupons type
 * @param {string} giftcards The giftcards type
 * @param {string} creator-codes The creator codes type
 *
 * @returns {CouponCode | GiftCardCode | CreatorCode}
 */
export type ApplyTypeToInterface<T extends ApplyType> = T extends "coupons"
    ? CouponCode
    : T extends "giftcards"
    ? GiftCardCode
    : T extends "creator-codes"
    ? CreatorCode
    : never;

/**
 * @type {PackageType}
 * @description The type of the package
 *
 * @param {string} subscription The subscription type
 * @param {string} single The single type
 */
export type PackageType = "subscription" | "single" | "both";

/**
 * @type {Package}
 * @description The package object returned from the Tebex Headless API
 *
 * @param {number} id The ID of the package
 * @param {string} name The name of the package
 * @param {string} description The description of the package
 * @param {PackageType} type The type of the package
 * @param {boolean} disable_gifting Whether gifting is disabled for the package
 * @param {boolean} disable_quantity Whether quantity is disabled for the package
 * @param {string | null} expiration_date The expiration date of the package
 * @param {BaseItem} category The category of the package
 * @param {number} base_price The base price of the package
 * @param {number} sales_tax The sales tax of the package
 * @param {number} total_price The total price of the package
 * @param {number} discount The discount of the package
 * @param {string | null} image The image of the package
 * @param {string} created_at The date the package was created
 * @param {string} updated_at The date the package was updated
 * @param {number} order The order this package should be sorted in
 */
export type Package = BaseItem & {
    description: string;
    type: PackageType;
    disable_gifting: boolean;
    disable_quantity: boolean;
    expiration_date: string | null;
    currency: string;
    category: BaseItem;
    base_price: number;
    sales_tax: number;
    total_price: number;
    discount: number;
    image: string | null;
    created_at: string;
    updated_at: string;
    order: number;
};

/**
 * @type {InBasket}
 * @description The in_basket object inside a basket package object
 *
 * @param {number} quantity The quantity of the package in the basket
 * @param {number} price The price of the package in the basket
 * @param {string | null} gift_username_id The ID of the user the package is gifted to
 * @param {string | null} gift_username The username of the user the package is gifted to
 */
export type InBasket = {
    quantity: number;
    price: number;
    gift_username_id: string | null;
    gift_username: string | null;
}

/**
 * @type {BasketPackage}
 * @description The basket package object returned from the Tebex Headless API
 *
 * @param {number} id The ID of the package
 * @param {string} name The name of the package
 * @param {string} description The description of the package
 * @param {InBasket} in_basket The in_basket object inside the basket package object
 * @param {string | null} image The image of the package
 */
export type BasketPackage = BaseItem & {
    description: string;
    in_basket: InBasket;
    image: string | null;
};

/**
 * @type {Code}
 * @description The code object inside the basket coupons object
 *
 * @param {string} code The code of the object
 */
export type Code = {
    code: string;
}

/**
 * @type {Links}
 * @description The links object inside the basket object
 *
 * @param {string} checkout The checkout link of the basket
 */
export type Links = {
    checkout: string;
    [key: string]: string;
}

/**
 * @type {Basket}
 * @description The basket object returned from the Tebex Headless API
 *
 * @param {string} ident The identifier of the basket
 * @param {boolean} complete Whether the basket is complete
 * @param {number} id The ID of the basket
 * @param {string} country The country of the basket
 * @param {string} ip The IP address of the user
 * @param {string | null} username_id The ID of the user
 * @param {string | null} username The username of the user
 * @param {string} cancel_url The cancel url of the basket
 * @param {string} complete_url The complete url of the basket
 * @param {boolean} complete_auto_redirect Whether the basket should automatically redirect to the complete url
 * @param {number} base_price The base price of the basket
 * @param {number} sales_tax The sales tax of the basket
 * @param {number} total_price The total price of the basket
 * @param {string} email The email of the basket
 * @param {string} currency The currency of the basket
 * @param {BasketPackage[]} packages The packages in the basket
 * @param {Code[]} coupons The coupons in the basket
 * @param {GiftCardCode[]} giftcards The giftcards in the basket
 * @param {string} creator_code The creator code of the basket
 * @param {Links} links The links of the basket
 * @param {KeyValuePair<string, any>} custom The custom object of the basket
 */
export type Basket = {
    ident: string;
    complete: boolean;
    id: number;
    country: string;
    ip: string;
    username_id: string | null;
    username: string | null;
    cancel_url: string;
    complete_url: string;
    complete_auto_redirect: boolean;
    base_price: number;
    sales_tax: number;
    total_price: number;
    email: string;
    currency: string;
    packages: BasketPackage[];
    coupons: Code[];
    giftcards: GiftCardCode[];
    creator_code: string;
    links: Links;
    custom: KeyValuePair<string, any>;
}

/**
 * @type {Urls}
 * @description The url object for the complete and cancel urls
 *
 * @param {string} complete_url The complete url
 * @param {string} cancel_url The cancel url
 */
export type Urls = {
    complete_url: string;
    cancel_url: string;
    custom?: KeyValuePair<string, any>;
    complete_auto_redirect?: boolean;
};

/**
 * @type {AuthUrl}
 * @description The auth url object returned from the Tebex Headless API
 *
 * @param {string} name The name of the auth url
 * @param {string} url The url of the auth url
 */
export type AuthUrl = {
    name: string;
    url: string;
}

/**
 * @type {PackageBody}
 * @description The package object for the body of the request
 *
 * @param {number} package_id The ID of the package
 * @param {number} quantity The quantity of the package
 * @param {PackageType} type The type of the package
 */
export type PackageBody = {
    package_id: number;
    quantity: number;
    type: PackageType;
}

/**
 * @type {Webstore}
 * @description The webstore object returned from the Tebex Headless API
 *
 * @param {number} id The ID of the webstore
 * @param {string} description The description of the webstore
 * @param {string} name The name of the webstore
 * @param {string} webstore_url The webstore url of the webstore
 * @param {string} currency The currency of the webstore
 * @param {string} lang The language of the webstore
 * @param {string} logo The logo of the webstore
 * @param {string} platform_type The platform type of the webstore
 * @param {number} platform_type_id The platform type ID of the webstore
 * @param {string} created_at The date the webstore was created
 */
export type Webstore = {
    id: number;
    description: string;
    name: string;
    webstore_url: string;
    currency: string;
    lang: string;
    logo: string;
    platform_type: string;
    platform_type_id: number;
    created_at: string;
}

/**
 * @type {Page}
 * @description The page object returned from the Tebex Headless API
 * 
 * @param {number} id The ID of the page
 * @param {string} created_at The date the page was created
 * @param {string} updated_at The date the page was updated
 * @param {number} account_id The ID of the account
 * @param {string} title The title of the page
 * @param {string} slug The slug of the page
 * @param {boolean} private Whether the page is private
 * @param {boolean} hidden Whether the page is hidden
 * @param {boolean} disabled Whether the page is disabled
 * @param {boolean} sequence Whether the page is in a sequence
 * @param {string} content The content of the page
*/
export type Page = {
    id: number;
    created_at: string;
    updated_at: string;
    account_id: number;
    title: string;
    slug: string;
    private: boolean;
    hidden: boolean;
    disabled: boolean;
    sequence: boolean;
    content: string;
}

export class TebexHeadless {
    constructor(
        /**
         * @constant webstoreIdentifier
         * @description A function to set the webstore identifier
         *
         * @param {string} identifier The identifier of the webstore
         *
         * @returns {void}
         */
        readonly webstoreIdentifier: string,
        /**
         * @private {privateKey}
         * @description A function to set the private key
         *
         * @param {string} key The private key of the webstore
         *
         * @returns {void}
         */
        private privateKey?: string
    ) {}

    /**
     * @function getCategories
     * @description A function to get the categories from the Tebex Headless API
     *
     * @param {boolean} includePackages Whether to include the packages in the categories
     * @param {string} basketIdent The identifier of the basket
     * @param {string} ipAddress The IP address of the user
     *
     * @returns {Promise<Category[]>}
     */
    async getCategories(
        includePackages?: boolean,
        basketIdent?: string,
        ipAddress?: string
    ): Promise<Category[]> {
        const { data }: Data<Category[]> = await Request(
            this.webstoreIdentifier,
            this.privateKey,
            "get",
            this.webstoreIdentifier,
            "accounts",
            "/categories",
            {
                includePackages,
                basketIdent,
                ipAddress,
            }
        );

        return data;
    }

    /**
     * @function getCategory
     * @description A function to get a category from the Tebex Headless API
     *
     * @param {number} id The ID of the category
     * @param {boolean} includePackages Whether to include the packages in the category
     * @param {string} basketIdent The identifier of the basket
     * @param {string} ipAddress The IP address of the user
     *
     * @returns {Promise<Category>}
     */
    async getCategory(
        id: number,
        includePackages?: boolean,
        basketIdent?: string,
        ipAddress?: string
    ): Promise<Category> {
        const { data }: Data<Category> = await Request(
            this.webstoreIdentifier,
            this.privateKey,
            "get",
            this.webstoreIdentifier,
            "accounts",
            `/categories/${id}`,
            {
                includePackages,
                basketIdent,
                ipAddress,
            }
        );

        return data;
    }

    /**
     * @function apply
     * @description A function to apply a coupon, giftcard or creator code to a basket
     *
     * @param {A} body The body of the request
     * @param {string} basketIdent The identifier of the basket
     * @param {ApplyType} type The type of the apply request
     *
     * @returns {Promise<Message>}
     */
    async apply<T extends ApplyType, A extends ApplyTypeToInterface<T>>(
        basketIdent: string,
        type: T,
        body: A
    ): Promise<Message> {
        return await Request<Message, A>(
            this.webstoreIdentifier,
            this.privateKey,
            "post",
            this.webstoreIdentifier,
            "accounts",
            `/baskets/${basketIdent}/${type}`,
            {},
            body
        );
    }

    /**
     * @function remove
     * @description A function to remove a coupon, giftcard or creator code from a basket
     *
     * @param {A} body The body of the request
     * @param {string} basketIdent The identifier of the basket
     * @param {ApplyType} type The type of the apply request
     *
     * @returns {Promise<Message>}
     */
    async remove<T extends ApplyType, A extends ApplyTypeToInterface<T>>(
        basketIdent: string,
        type: T,
        body: A
    ): Promise<Message> {
        return await Request<Message, A>(
            this.webstoreIdentifier,
            this.privateKey,
            "post",
            this.webstoreIdentifier,
            "accounts",
            `/baskets/${basketIdent}/${type}/remove`,
            {},
            body
        );
    }

    /**
     * @function getPackage
     * @description A function to get a package from the Tebex Headless API
     *
     * @param {number} id The ID of the package
     * @param {string} basketIdent The identifier of the basket
     * @param {string} ipAddress The IP address of the user
     *
     * @returns {Promise<Package>}
     */
    async getPackage(
        id: number,
        basketIdent?: string,
        ipAddress?: string
    ): Promise<Package> {
        const { data }: Data<Package> = await Request(
            this.webstoreIdentifier,
            this.privateKey,
            "get",
            this.webstoreIdentifier,
            "accounts",
            `/packages/${id}`,
            {
                basketIdent,
                ipAddress,
            }
        );

        return data;
    }

    /**
     * @function getPackages
     * @description A function to get all packages from the Tebex Headless API
     *
     * @param {string} basketIdent The identifier of the basket
     * @param {string} ipAddress The IP address of the user
     *
     * @returns {Promise<Package[]>}
     */
    async getPackages(
        basketIdent?: string,
        ipAddress?: string
    ): Promise<Package[]> {
        const { data }: Data<Package[]> = await Request(
            this.webstoreIdentifier,
            this.privateKey,
            "get",
            this.webstoreIdentifier,
            "accounts",
            `/packages`,
            {
                basketIdent,
                ipAddress,
            }
        );

        return data;
    }

    /**
     * @function getBasket
     * @description A function to get a basket from the Tebex Headless API
     *
     * @param {string} basketIdent The identifier of the basket
     *
     * @returns {Promise<Package[]>}
     */
    async getBasket(basketIdent: string): Promise<Basket> {
        const { data }: Data<Basket> = await Request(
            this.webstoreIdentifier,
            this.privateKey,
            "get",
            this.webstoreIdentifier,
            "accounts",
            `/baskets/${basketIdent}`
        );
        return data;
    }

    /**
     * @function createBasket
     * @description A function to create a basket from the Tebex Headless API
     *
     * @param {string} complete_url The complete url
     * @param {string} cancel_url The cancel url
     * @param {KeyValuePair<string, any>} custom The custom object of the basket
     * @param {boolean} complete_auto_redirect Whether the basket should automatically redirect to the complete url
     * @param {string} ip_address The IP address of the user
     *
     * @returns {Promise<Basket>}
     */
    async createBasket(
        complete_url: string,
        cancel_url: string,
        custom?: KeyValuePair<string, any>,
        complete_auto_redirect?: boolean,
        ip_address?: string
    ): Promise<Basket> {
        const { data }: Data<Basket> = await Request(
            this.webstoreIdentifier,
            this.privateKey,
            "post",
            this.webstoreIdentifier,
            "accounts",
            "/baskets",
            {
                ip_address,
            },
            {
                complete_url,
                cancel_url,
                custom,
                complete_auto_redirect,
            }
        );

        return data;
    }

    /**
     * @function createMinecraftBasket
     * @description A function to create a minecraft basket from the Tebex Headless API
     *
     * @param {string} username The username of the user
     * @param {string} complete_url The complete url
     * @param {string} cancel_url The cancel url
     * @param {KeyValuePair<string, any>} custom The custom object of the basket
     * @param {boolean} complete_auto_redirect Whether the basket should automatically redirect to the complete url
     * @param {string} ip_address The IP address of the user
     *
     * @returns {Promise<Basket>}
     */
    async createMinecraftBasket(
        username: string,
        complete_url: string,
        cancel_url: string,
        custom?: KeyValuePair<string, any>,
        complete_auto_redirect?: boolean,
        ip_address?: string
    ): Promise<Basket> {
        const { data }: Data<Basket> = await Request(
            this.webstoreIdentifier,
            this.privateKey,
            "post",
            this.webstoreIdentifier,
            "accounts",
            "/baskets",
            {
                ip_address,
            },
            {
                username,
                complete_url,
                cancel_url,
                custom,
                complete_auto_redirect,
            }
        );

        return data;
    }

    /**
     * @function getBasketAuthUrl
     * @description A function to get the auth url of a basket from the Tebex Headless API
     *
     * @param {string} basketIdent The identifier of the basket
     * @param {string} returnUrl The return url of the basket
     *
     * @returns {Promise<AuthUrl[]>} The data returned or an axios error
     */
    async getBasketAuthUrl(
        basketIdent: string,
        returnUrl: string
    ): Promise<AuthUrl[]> {
        return await Request(
            this.webstoreIdentifier,
            this.privateKey,
            "get",
            this.webstoreIdentifier,
            "accounts",
            `/baskets/${basketIdent}/auth`,
            {
                returnUrl,
            }
        );
    }

    /**
     * @function addPackageToBasket
     * @description A function to add a package to a basket from the Tebex Headless API
     *
     * @param {string} basketIdent The identifier of the basket
     * @param {number} package_id The ID of the package
     * @param {number} quantity The quantity of the package
     * @param {PackageType} type The type of the package
     * @param {KeyValuePair<string, any>} variable_data The variable data of the package
     *
     * @returns {Promise<Basket>}
     */
    async addPackageToBasket(
        basketIdent: string,
        package_id: number,
        quantity: number,
        type?: PackageType,
        variable_data?: KeyValuePair<string, any>
    ): Promise<Basket> {
        const { data }: Data<Basket> = await Request(
            this.webstoreIdentifier,
            this.privateKey,
            "post",
            basketIdent,
            "baskets",
            "/packages",
            {},
            {
                package_id,
                quantity,
                type,
                variable_data,
            }
        );

        return data;
    }

    /**
     * @function giftPackage
     * @description A function to gift a package to a user from the Tebex Headless API
     *
     * @param {string} basketIdent The identifier of the basket
     * @param {number} package_id The ID of the package
     * @param {string} target_username_id The ID of the user to gift the package to
     *
     * @returns {Promise<Basket>}
     */
    async giftPackage(
        basketIdent: string,
        package_id: number,
        target_username_id: string
    ): Promise<Basket> {
        const { data }: Data<Basket> = await Request(
            this.webstoreIdentifier,
            this.privateKey,
            "post",
            basketIdent,
            "baskets",
            "/packages",
            {},
            {
                package_id,
                target_username_id,
            }
        );

        return data;
    }

    /**
     * @function removePackage
     * @description A function to remove a package from a basket from the Tebex Headless API
     *
     * @param {string} basketIdent The identifier of the basket
     * @param {number} package_id The ID of the package
     *
     * @returns {Promise<Basket>}
     */
    async removePackage(
        basketIdent: string,
        package_id: number
    ): Promise<Basket> {
        const { data }: Data<Basket> = await Request(
            this.webstoreIdentifier,
            this.privateKey,
            "post",
            basketIdent,
            "baskets",
            "/packages/remove",
            {},
            {
                package_id,
            }
        );

        return data;
    }

    /**
     * @function updateQuantity
     * @description A function to update the quantity of a package in a basket from the Tebex Headless API
     *
     * @param {string} basketIdent The identifier of the basket
     * @param {number} package_id The ID of the package
     * @param {number} quantity The quantity of the package
     *
     * @returns {Promise<Basket>}
     */
    async updateQuantity(
        basketIdent: string,
        package_id: number,
        quantity: number
    ): Promise<Basket> {
        const { data }: Data<Basket> = await Request(
            this.webstoreIdentifier,
            this.privateKey,
            "put",
            basketIdent,
            "baskets",
            `/packages/${package_id}`,
            {},
            {
                quantity,
            }
        );

        return data;
    }

    /**
     * @function getWebstore
     * @description A function to get the webstore from the Tebex Headless API
     *
     * @returns {Promise<Webstore>}
     */
    async getWebstore(): Promise<Webstore> {
        const { data }: Data<Webstore> = await Request(
            this.webstoreIdentifier,
            this.privateKey,
            "get",
            this.webstoreIdentifier,
            "accounts"
        );
        return data;
    }

    /**
     * @function getPages
     * @description A function to get the pages from the Tebex Headless API
     * 
     * @returns {Promise<Page>}
    */
    async getPages(): Promise<Array<Page>> {
        const { data }: Data<Array<Page>> = await Request(
            this.webstoreIdentifier,
            this.privateKey,
            "get",
            this.webstoreIdentifier,
            "accounts",
            "/pages"
        );

        return data;
    }

    /**
     * @function updateTier
     * @description Update an tier of an package
     *
     * @param {unknown} tierId The ID of the tier
     * @param {number} package_id The ID of the package
     *
     * @returns {Promise<Message>}
     */
    async updateTier(tierId: unknown, package_id: number): Promise<Message> {
        return await Request(
            this.webstoreIdentifier,
            this.privateKey,
            "patch",
            this.webstoreIdentifier,
            "accounts",
            `/tiers/${tierId}`,
            {},
            {
                package_id,
            }
        );
    }
}
