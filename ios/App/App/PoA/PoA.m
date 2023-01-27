//
//  POA.m
//  App
//
//  Created by Роман Бурлин on 19.11.2022.
//

#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

CAP_PLUGIN(PoA, "PoA",
           CAP_PLUGIN_METHOD(getM, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(start, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(stop, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(updateMiner, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(minerSwitch, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(getMiners, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(changeIPAllMiners, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(getServiceStatus, CAPPluginReturnPromise);
           )
