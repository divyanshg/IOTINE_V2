var WSCartDialog = (function(settings) {
	var settings = $.extend({
		$dialog: $("#sm-cart-dialog"),
		$dialogOverlay: $("#sm-cart-dialog-overlay")
	}, settings);

	settings.$dialog.find(".header .hpi-close")
		.add(settings.$dialogOverlay)
		.add(settings.$dialog.find('.continue-shopping-btn'))
		.click(function() {
			_wsDialog.hide();
		});

	var _wsDialog = {
		show: function() {
			this.render();

			settings.$dialog.addClass("active");

			return this;
		},

		hide: function() {
			settings.$dialog.removeClass("active");

			return this;
		},

		showEmptyCart: function() {
			console.log('show empty cart');
		},

		updatePrices: function() {
			var subtotal = 0;

			var currencyCode = settings.$dialog.find(".sm-cart-currencyCode").val();
			var currencySymbol = settings.$dialog.find(".sm-cart-currencySymbol").val();
			var decimals = settings.$dialog.find(".sm-cart-decimals").val();
			var currencyPrefix = settings.$dialog.find(".sm-cart-currencyPrefix").val() == 'NO' ? false : true;

			settings.$dialog.find(".cart-items").find('li').each(function() {
				var $this = $(this);

				var price = parseFloat($this.data('price'));
				//var qty = parseInt($this.find('.cart-item-qty').val());
				var qty = parseInt($this.find('.cart-item-qty-ribbon').text());

				var finalPrice = price * qty;
				subtotal += finalPrice;

				$this.find('.cart-item-price').text(
					(currencyPrefix ? currencySymbol : '') + finalPrice.formatMoney(decimals) + (!currencyPrefix ? currencySymbol : '')
				)
			});

			settings.$dialog.find(".cart-subtotal").text(
				currencyCode + ' ' + (currencyPrefix ? currencySymbol : '') + subtotal.formatMoney(decimals) + (!currencyPrefix ? currencySymbol : '')
			);
		},

		render: function() {
			var items = WSCart.getItems();

			if(items.length) {
				var storeID = settings.$dialog.find(".sm-cart-storeID").val();
				var itemData = WSStore.getItemData(WSCart.getItemKeys(), storeID);

				var html = "";
				var numOfValidItems = 1;
				
				var isValid = true;

				for(var j = 0; j < items.length; j++) {
					var item = items[j];

					var itemKey = item.get('itemKey');
					var itemDetail = itemData.details[itemKey];

					if(itemDetail) {
						var images = $.parseJSON(itemDetail.IMAGES);

						var imgSrc = (images.length) ? fm_getFilePath({
							filename: images[0],
							isThumbnail: true,
							siteID: storeID,
							replaceStock: "_stock_product.png"
						}) : "/img/fm_stock/thumb/_stock_product.png";

						var choicesLabel = "";
						var choices = $.parseJSON(itemDetail.CHOICES);
						if(choices) {
							for(var i = 0; i < choices.length; i++) {
								var choice = choices[i];
								for(var choiceKey in choice) {
									choicesLabel += encodeForHTML(choiceKey) + ": " + encodeForHTML(choice[choiceKey]) + ", ";
								}
							}
							choicesLabel = choicesLabel.substring(0, choicesLabel.length - 2);
						}

						var qty = item.get("qty");

						var productURL = settings.$dialog.find(".sm-product-url").val() + '/' + (itemDetail.SLUG || itemDetail.ITEMKEY_ROOT);

						var price = WSStore.getDiscountedPrice(itemDetail.PRICE, itemDetail.DISCOUNTVALUE, itemDetail.DISCOUNTTYPE);

						html += '<li data-itemkey="' +  itemKey + '" data-price="' +  price + '">';
						html +=		'<span class="cart-item-qty-ribbon" title="' + qty +'">' + qty + '</span>'
						html += 	'<a class="cart-item-image" href="' + productURL + '" target="_blank" style="background-image: url(' +  imgSrc +')"></a>';
						html += 	'<div class="cart-item-content-container">';
						html +=			'<a href="' + productURL + '" target="_blank" class="cart-item-name" title="' + encodeForHTML(itemDetail.NAME) +'">' + encodeForHTML(itemDetail.NAME) + '</a>'
						
						if(choicesLabel || (item.get('customTextLabel') && item.get('customText'))) {
							html +=			'<div>';

							if(choicesLabel) {
								html += '<div title="' + choicesLabel + '">' + choicesLabel + '</div>';
							}

							if(item.get('customTextLabel') && item.get('customText')) {
								html += '<div title="' + encodeForHTML(item.get('customTextLabel')) + ': ' + encodeForHTML(item.get('customText')) + '">' + encodeForHTML(item.get('customTextLabel')) + ': ' + encodeForHTML(item.get('customText')) + '</div>';
							}

							html +=			'</div>';
						}

						html += 		'<div class="price-qty-container">';
						html += 			'<span class="cart-item-price"></span>'
						/* 
						dont want to deal with inventory quantity
						html +=				'<div class="quantity-container">';
						html +=					'<i class="hpi-icon hpi-remove"></i>';
						html +=					'<input class="cart-item-qty" maxlength="3" minlength="0" type="text" value="' + qty +'" />';
						html +=					'<i class="hpi-icon hpi-add"></i>';
						html +=				'</div>';
						*/
						html +=			'</div>';

						html +=		'</div>';
						html += 	'<input name="sm-cart-item-itemKey-' + numOfValidItems + '" type="hidden" class="sm-cart-item-itemKey" value="' + item.get("itemKey") + '">';
						html += 	'<input name="sm-cart-item-customTextLabel-' + numOfValidItems + '" type="hidden" class="sm-cart-item-customTextLabel" value="' + encodeForHTML(item.get("customTextLabel")) + '">';
						html += 	'<input name="sm-cart-item-customText-' + numOfValidItems + '" type="hidden" class="sm-cart-item-customText" value="' + encodeForHTML(item.get("customText")) + '">';
						html += 	'<input name="sm-cart-item-qty-' + numOfValidItems + '" type="hidden" class="sm-cart-item-qty-input" value="' + qty + '">';
						html += '</li>';

						if(itemDetail.INVENTORYSTATUS_ROOT == 4 && itemDetail.OUTOFSTOCKPURCHASE == false && qty > itemDetail.INVENTORY) {
							isValid = false;
						} else if(itemData.status[itemKey] != "ok") {
							isValid = false;
						} else if(itemData.status[itemKey] === "ok") {
							numOfValidItems++;
						}
					}
				}

				

				settings.$dialog.find(".cart-items").html(html);

				/*
				var self = this;

				// attach quantity input handler
				settings.$dialog.find('.cart-item-qty').change(event => {
					var $qty = $(event.currentTarget);

					var qty = parseInt($qty.val());
					if(!$.isNumeric(qty)) {
						qty = 1;
					}
					qty = Math.max(Math.min(qty, 10000), 0);

					$qty.val(qty);

					if(qty <= 0) {
						// remove it
						$qty.closest('li').remove();

						// remove the cart item

						if(!settings.$dialog.find('.cart-items li').length) {
							this.showEmptyCart();
						}
					} else {
						// update the cart item quantity
					}

					self.updatePrices();
				});

				settings.$dialog.find('.quantity-container .hpi-icon').click(event => {
					var $target = $(event.currentTarget);
					var $qty = $target.siblings('.cart-item-qty');

					var qty = parseInt($qty.val());

					if($target.hasClass('hpi-add')) {
						qty++;
					} else {
						qty--;
					}

					$qty.val(qty).trigger('change');
				});
				*/

				this.updatePrices();
			}
			
			settings.$dialog.find('.cart-btn').removeClass('cart-btn-fill').show();
			settings.$dialog.find('.cart-subtotal-container').show();
			
			if(!items.length) { // no items
				settings.$dialog.find("#sm-cart-checkout-cart-btn, #sm-cart-edit-cart-btn").hide();
				settings.$dialog.find('.continue-shopping-btn').addClass('cart-btn-fill');
				settings.$dialog.find('.cart-subtotal-container').hide();

				settings.$dialog.find(".cart-items").html(
					'<div class="cart-empty-message">Your Shopping Cart is Empty</div>'
				);
			} else if(!isValid) { // one or more items has errors
				settings.$dialog.find("#sm-cart-checkout-cart-btn").hide();
				settings.$dialog.find('#sm-cart-edit-cart-btn').addClass('cart-btn-fill');
			} else {
				settings.$dialog.find('#sm-cart-checkout-cart-btn').addClass('cart-btn-fill');
			}
			
			// hidden inputs
			settings.$dialog.find(".sm-cart-num-items").val(numOfValidItems - 1);

			return this;
		},

		add: function() {
			// add. if item key exists, add to qty
			return this;
		},

		remove: function(itemKey) {
			return this;
		}
	};

	return _wsDialog;
})();

var WSCart = (function(settings) {
	var _wsCart =  {
		CartItem: function(attr) {
			var _attributes = $.extend(true, {
				itemKey: "",
				qty: 0,
				customText: '',
				customTextLabel: ''
			}, attr);

			this.set = function(nameOrStruct, value) {
				if(typeof nameOrStruct === "object") {
					_attributes = $.extend(true, {}, nameOrStruct);
				} else {
					_attributes[nameOrStruct] = value;
				}

				if(this.get("qty") > 999) {
					this.set("qty", 999);
				}

				return this;
			};

			this.get = function(name) {
				return _attributes[name];
			};

			this.toJSON = function() {
				return $.extend(true, {}, _attributes);
			};

			this.save = function() {
				_wsCart.save();
			}
		},

		addItem: function(cartItem) {
			var _cartItem = this.getItem(cartItem);

			if(_cartItem) {
				var newQty = cartItem.get("qty") + _cartItem.get("qty");
				_cartItem.set("qty", newQty);
			} else {
				_items.push(cartItem);
			}

			this.updateCartIcon();

			if(WSCartDialog) WSCartDialog.show();

			save();
			return this;
		},

		removeItem: function(itemKey, skipUpdateCartIcon) {
			skipUpdateCartIcon = (typeof skipUpdateCartIcon !== "undefined") ? skipUpdateCartIcon : false;

			for(var i = 0; i < _items.length; i++) {
				if(_items[i].get("itemKey") === itemKey)
					_items.splice(i, 1);
			}
			if(!skipUpdateCartIcon) {
				this.updateCartIcon();
			}
			save();
			return this;
		},

		setItem: function(cartItem) {
			this.get(cartItem.get("itemKey")).set(cartItem);
			save();
			return this;
		},

		clear: function() {
			_items = [];
			this.updateCartIcon();
			save();
			return this;
		},

		getItem: function(itemOrItemKey) {
			if(typeof itemOrItemKey == 'string') {
				for(var i = 0; i < _items.length; i++) {
					if(_items[i].get("itemKey") === itemOrItemKey)
						return _items[i];
				}
			} else if(typeof itemOrItemKey == 'object') {
				for(var i = 0; i < _items.length; i++) {
					var _item = _items[i];

					if(itemOrItemKey.get) {
						if(_item.get("itemKey") == itemOrItemKey.get('itemKey') && _item.get("customText") == itemOrItemKey.get('customText') && _item.get("customTextLabel") == itemOrItemKey.get('customTextLabel'))
							return _item;
					} else {
						if(_item.get("itemKey") == itemOrItemKey.itemKey && _item.get("customText") == itemOrItemKey.customText && _item.get("customTextLabel") == itemOrItemKey.customTextLabel)
							return _item;
					}
				}
			}

			return null;
		},

		getItems: function() {
			return $.extend(true, [], _items);
		},

		getItemKeys: function() {
			var itemKeys = [];
			for(var i = 0; i < _items.length; i++)
				itemKeys.push(_items[i].get("itemKey"));
			return $.extend(true, [], itemKeys);
		},

		toJSON: function() {
			return JSON.stringify(_items);
		},

		hasCartIcon: function() {
			return _settings.$cartCounter.length ? true : false;
		},

		updateCartIcon: function() {
			var numOfItems = 0;
			for(var i = 0; i < _items.length; i++) {
				numOfItems += _items[i].get("qty");
			}
			_settings.$cartCounter.text(numOfItems);
			return this;
		},

		save: function() {
			save();
		}
	};

	var save = function() {
		if(hasLocalStorage()) {
			if(_settings.storage) {
				_settings.storage.setItem(_itemsStorageKey, _wsCart.toJSON())
			}
		} else {
			$.cookie(_itemsStorageKey, _wsCart.toJSON(), { path: '/' });
		}
	};

	var getStorageItems = function() {
		var items = [];

		var storageItemsJSON = "";

		if(hasLocalStorage()) {
			if(_settings.storage) {
				storageItemsJSON = _settings.storage.getItem(_itemsStorageKey);
			}
		} else {
			storageItemsJSON = $.cookie(_itemsStorageKey);
		}

		if(storageItemsJSON) {
			var storageItemsJSON =  JSON.parse(storageItemsJSON) || [];
			for(var i = 0; i < storageItemsJSON.length; i++) {
				items.push(new _wsCart.CartItem(storageItemsJSON[i]));
			}
		}

		return items;
	};

	var _settings = $.extend(true, {
		storage: (hasLocalStorage()) ? localStorage : '',
		storagePrefix: "ws_cart",
		$cartCounter: $(".shopping-cart-counter")
	}, settings);

	var domain = _siteDomain;

	var _itemsStorageKey = _settings.storagePrefix + "_items_" + domain;
	var _items = getStorageItems();
	_wsCart.updateCartIcon();

	return _wsCart;
})(jQuery);


WSStore = {};

WSStore.itemStatus = {
	OK: "ok",
	INVALID: "invalid",
	DELETED: "deleted",
	PICKVARIANT: "pickVariant"
};

WSStore.inventoryStatus = {
	STOCK: 0,
	LOW: 1,
	BACKORDER: 2,
	OUT: 3
};

WSStore.getItemData = function(itemKeys, storeID, url) {
	var itemData = {
		status: {},
		details: {},
		currency: "USD"
	};

	if(itemKeys && storeID) {
		$.ajax({
			url: (url) ? url : "/_storeManager.checkout.getItemData",
			dataType: "json",
			async: false,
			type: "POST",
			data: {
				itemKeys: JSON.stringify(itemKeys),
				storeID: storeID
			},
			success: function(response) {
				itemData = response;
			},
			error: function(xhr) {
				alert(xhr.responseText);
			}
		});
	} else {
		alert("There is a problem getting store information. Please try again later.")
	}

	return itemData;
};

WSStore.getCurrency = function(storeID, url) {
	var currency = "USD";
/*
	if(App.currency) {
		return App.currency;
	}
*/
	if(storeID) {
		$.ajax({
			url: (url) ? url : "/_storeManager.checkout.getCurrency",
			dataType: "json",
			async: false,
			type: "POST",
			data: {
				storeID: storeID
			},
			success: function(response) {
				currency = response;
			},
			error: function(xhr) {
				alert(xhr.responseText);
			}
		});
	} else {
		alert("There is a problem getting store information. Please try again later.")
	}
/*
	if(App) {
		App.currency = currency;
	}
*/
	return currency;
};

WSStore.getSupportCurrencies = function() {
	/*
	NOT USED ANYMORE
	*/
	return [
		{
			label: 'Australian Dollar',
			code: 'AUD',
			symbol: '$'
		},
		{
			label: 'Bangladeshi taka',
			code: 'BDT',
			symbol: '৳'
		},
		{
			label: 'Brazilian Real',
			code: 'BRL',
			symbol: 'R$'
		},
		{
			label: 'Canadian Dollar',
			code: 'CAD',
			symbol: '$'
		},
		{
			label: 'Danish Krone',
			code: 'DKK',
			symbol: 'kr'
		},
		{
			label: 'Euro',
			code: 'EUR',
			symbol: '€'
		},
		{
			label: 'Hong Kong Dollar',
			code: 'HKD',
			symbol: '$'
		},
		{
			label: 'Hungarian Forint',
			code: 'HUF',
			symbol: 'Ft'
		},
		{
			label: 'Indian rupee',
			code: 'INR',
			symbol: '₹'
		},
		{
			label: 'Israeli New Sheqel',
			code: 'ILS',
			symbol: '₪'
		},
		{
			label: 'Japanese Yen',
			code: 'JPY',
			symbol: '円'
		},
		{
			label: 'Malaysian ringgit',
			code: 'MYR',
			symbol: 'RM'
		},
		{
			label: 'Mexican  Peso',
			code: 'MXN',
			symbol: '$'
		},
		{
			label: 'Mauritian rupee',
			code: 'MUR',
			symbol: '₨'
		},
		{
			label: 'Norwegian Krone',
			code: 'NOK',
			symbol: 'kr'
		},
		{
			label: 'New Zealand Dollar',
			code: 'NZD',
			symbol: '$'
		},
		{
			label: 'Pakistani Rupee',
			code: 'PKR',
			symbol: '₨'
		},
		{
			label: 'Philippine Peso',
			code: 'PHP',
			symbol: '₱'
		},
		{
			label: 'Polish Zloty',
			code: 'PLN',
			symbol: 'zł'
		},
		{
			label: 'Pound Sterling',
			code: 'GBP',
			symbol: '£'
		},
		{
			label: 'Serbian Dinar',
			code: 'RSD',
			symbol: 'Дин.'
		},
		{
			label: 'Singapore Dollar',
			code: 'SGD',
			symbol: '$'
		},
		{
			label: 'South African Rand',
			code: 'ZAR',
			symbol: 'R'
		},
		{
			label: 'Swedish Krona',
			code: 'SEK',
			symbol: 'kr'
		},
		{
			label: 'Swiss franc',
			code: 'CHF',
			symbol: 'CHf'
		},
		{
			label: 'Taiwan New Dollar',
			code: 'TWD',
			symbol: '$'
		},
		{
			label: 'Thai Baht',
			code: 'THB',
			symbol: '฿'
		},
		{
			label: 'United Arab Emirates dirham',
			code: 'AED',
			symbol: 'د.إ'
		},
		{
			label: 'US Dollar',
			code: 'USD',
			symbol: '$'
		},
	]
};


WSStore.getCurrencySymbol = function(currencyCode) {
	// Editor Side
	if(typeof App !== 'undefined' && App.currencies && App.currencies[currencyCode]) {
		return App.currencies[currencyCode].symbol;
	}

	return "$";
};

WSStore.getDiscountedPrice = function(orgPrice, discountValue, discountType) {
	var discountedPrice = orgPrice;

	if(discountValue > 0) {
		if(discountType === "%") {
			discountedPrice *= (1 - (discountValue / 100))
		} else {
			discountedPrice -= discountValue;
		}
	}

	return discountedPrice;
};

WSStore.getOrignalPrice = function(discountedPrice, discountValue, discountType) {
	var orgPrice = discountedPrice;

	if(discountValue > 0) {
		if(discountType === "%") {
			orgPrice /= (1 - (discountValue / 100));
		} else {
			orgPrice += discountValue;
		}
	}

	return orgPrice;
};

WSStore.sortStoreProducts = function(products, sortMode, options) {
	options = $.extend({
		discountPrice: false, // already in discounted Price format
		sortCustom: []
	}, options);

	if(sortMode === "custom") {
		var customProducts = [];

		for(var i = 0; i < options.sortCustom.length; i++) {
			var sortCustomItemKey = options.sortCustom[i];

			for(var j = 0; j < products.length; j++) {
				var product = products[j];
				if(product.itemKey === sortCustomItemKey) {
					products.splice(j, 1);
					customProducts.push(product);
					break;
				}
			}
		}

		return customProducts.concat(products);
	} if(sortMode == "nameAsc") {
		products = products.sort(function(a,b) {
			if(a.name.toLowerCase() < b.name.toLowerCase()) return -1;
	    if(a.name.toLowerCase() > b.name.toLowerCase()) return 1;
	    return 0;
		});
	} else if(sortMode === "nameDesc") {
		products = products.sort(function(a,b) {
			if(a.name.toLowerCase() < b.name.toLowerCase()) return -1;
	    if(a.name.toLowerCase() > b.name.toLowerCase()) return 1;
	    return 0;
		}).reverse();
	} else if(sortMode === "priceAsc") {
		products = products.sort(function(a,b) {
			var aP = a.price;
			var bP = b.price;

			if(!options.discountPrice && WSStore) {
				var aP = WSStore.getDiscountedPrice(a.price, a.discountValue, a.discountType);
				var bP = WSStore.getDiscountedPrice(b.price, b.discountValue, b.discountType);
			}

			if(aP < bP) return -1;
	    if(aP > bP) return 1;
	    return 0;
		});
	} else if(sortMode === "priceDesc") {
		products = products.sort(function(a,b) {
			var aP = a.price;
			var bP = b.price;

			if(!options.discountPrice && WSStore) {
				var aP = WSStore.getDiscountedPrice(a.price, a.discountValue, a.discountType);
				var bP = WSStore.getDiscountedPrice(b.price, b.discountValue, b.discountType);
			}

			if(aP < bP) return -1;
	    if(aP > bP) return 1;
	    return 0;
		}).reverse();
	} else {
		products = products.sort(function(a,b) {
			return new Date(b.createdDate) - new Date(a.createdDate);
		});
	}
	return products;
}

WSStore.isProductOutOfStock = function(product) {
	if(product.inventoryStatus == 4 && product.inventory < 0 && product.outOfStockPurchase == 0) {
		return true;
	}

	return !(product.inventoryStatus !== WSStore.inventoryStatus.OUT && product.inventoryStatus !== WSStore.inventoryStatus.BACKORDER);
}

WSStore.filterStoreProductsSearch = function(products, filter) {
	if(filter.search) {
		products = products.filter(function(product) {
			return String(product.name).toLowerCase().indexOf(filter.search.toLowerCase()) !== -1 || String(product.sku).toLowerCase().indexOf(filter.search.toLowerCase()) !== -1;
		});
	}

	if(typeof filter.priceMax !== "undefined" && filter.priceMax > 0 && typeof filter.priceMin !== "undefined" && filter.priceMin >= 0) {
		products = products.filter(function(product) {
			var productPrice = WSStore.getDiscountedPrice(product.price, product.discountValue, product.discountType);
			return (productPrice <= filter.priceMax && productPrice >= filter.priceMin)
		});
	} else if(filter.priceMax === 0 && filter.priceMin === 0) {
		products = products.filter(function(product) {
			var productPrice = WSStore.getDiscountedPrice(product.price, product.discountValue, product.discountType);
			return (productPrice == 0)
		});
	}

	if(filter.onSale) {
		products = products.filter(function(product) {
			return product.discountValue > 0;
		});
	}

	if(filter.inStock) {
		products = products.filter(function(product) {
			return !WSStore.isProductOutOfStock(product);
		});
	}

	if(filter.isNew && filter.isNewRange) {
		var todayDate = new Date();

		products = products.filter(function(product) {
			var date = getLocalDateFromUTC(product.updatedDate, false);
			var betweenDays = numDaysBetweenDates(todayDate, date);

			return (betweenDays > 0 && betweenDays < filter.isNewRange);
		});
	}

	if(filter.collections && filter.collections.length) {
		var allProductItemKeys = [];

		for(var i = 0; i < filter.collections.length; i++) {
			var productItemKeys = filter.collections[i].productItemKeys;
			for(var j = 0; j < productItemKeys.length; j++) {
				allProductItemKeys.push(productItemKeys[j]);
			}
		}

		products = products.filter(function(product) {
			return allProductItemKeys.indexOf(product.itemKey) !== -1;
		});
	}

	return products;
}

WSStore.getAllPrices = function(products) {
	var prices = [];
	for(var i = 0; i < products.length; i++) {
		var product = products[i];
		prices.push(WSStore.getDiscountedPrice(product.price, product.discountValue, product.discountType));
	}
	return prices;
}
