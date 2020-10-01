package com.pehchevskip.safedocssystem.filter;

import org.springframework.stereotype.Component;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

@Component
public class DispatcherFilter implements Filter {

  /**
   * Regex to check if URL is not for controllers (/api/**)
   */
  private final String API_PATTERN = "^/api/(.+)$";

  /**
   * Regex to check if there are no "." in URL
   */
  private final String POINT_EXCLUSION_PATTERN = "^([^.]+)$";

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
    HttpServletRequest servletRequest = (HttpServletRequest) request;
    String requestURI = servletRequest.getRequestURI();
    String contextPath = servletRequest.getContextPath();
    if(!requestURI.equals(contextPath) &&
        !requestURI.matches(API_PATTERN) &&
        requestURI.matches(POINT_EXCLUSION_PATTERN)
    ) {
      RequestDispatcher dispatcher = request.getRequestDispatcher("/");
      dispatcher.forward(request, response);
      return;
    }
    chain.doFilter(request, response);
  }

}
