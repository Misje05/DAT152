/**
 * 
 */
package no.hvl.dat152.rest.ws.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import no.hvl.dat152.rest.ws.model.Author;
import no.hvl.dat152.rest.ws.repository.AuthorRepository;

/**
 * 
 */
@Service
public class AuthorService {

	@Autowired
	private AuthorRepository authorRepository;
	
	public Author findById(int id) {
		
		return authorRepository.findById(id).get();
	}

}
