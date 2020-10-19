package com.pehchevskip.safedocssystem.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Profile("!prod")
@Configuration
@EnableWebSecurity
public class BasicAuthDevConfiguration extends WebSecurityConfigurerAdapter {

  @Autowired
  private DatabaseAuthenticationProvider databaseAuthenticationProvider;

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http
            .cors().configurationSource(corsConfig())
            .and()
            .csrf().disable()
            .authorizeRequests()
            .antMatchers(HttpMethod.POST, "/api/login")
            .permitAll()
            .antMatchers(HttpMethod.POST, "/api/users")
            .permitAll()
            .antMatchers("/api/**")
            .authenticated()
            .antMatchers("/*")
            .permitAll()
            .and()
            .httpBasic();
  }

  @Override
  protected void configure(AuthenticationManagerBuilder auth) {
    auth.authenticationProvider(databaseAuthenticationProvider);
  }

  private CorsConfigurationSource corsConfig() {
    final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    CorsConfiguration config = new CorsConfiguration();
    config.addAllowedHeader("*");
    config.addExposedHeader("authorization");
    config.addAllowedOrigin("http://localhost:4200");
    config.addAllowedMethod("*");
    source.registerCorsConfiguration("/**", config.applyPermitDefaultValues());
    return source;
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

}
