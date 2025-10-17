package com.vibechat.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.net.Proxy;
import java.net.ProxySelector;
import java.net.SocketAddress;
import java.net.InetSocketAddress;
import java.net.URI;
import java.util.List;
import java.util.Arrays;

@Configuration
public class SocksProxyConfig {

    @Bean
    public ProxySelector socksProxySelector() {
        return new ProxySelector() {
            private final Proxy socksProxy = new Proxy(Proxy.Type.SOCKS,
                new InetSocketAddress("127.0.0.1", 1080));

            @Override
            public List<Proxy> select(URI uri) {
                // Use SOCKS proxy for external connections
                if (uri.getHost() != null && !uri.getHost().equals("localhost") &&
                    !uri.getHost().equals("127.0.0.1")) {
                    return Arrays.asList(socksProxy);
                }
                return Arrays.asList(Proxy.NO_PROXY);
            }

            @Override
            public void connectFailed(URI uri, SocketAddress sa, java.io.IOException ioe) {
                System.err.println("Connection failed to " + uri + " via " + sa + ": " + ioe.getMessage());
            }
        };
    }
}
