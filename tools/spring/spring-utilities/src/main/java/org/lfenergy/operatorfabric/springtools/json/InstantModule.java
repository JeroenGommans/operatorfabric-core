/* Copyright (c) 2018-2020, RTE (http://www.rte-france.com)
 * See AUTHORS.txt
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * SPDX-License-Identifier: MPL-2.0
 * This file is part of the OperatorFabric project.
 */



package org.lfenergy.operatorfabric.springtools.json;

import com.fasterxml.jackson.databind.module.SimpleModule;

import java.time.Instant;

/**
 * Jackson (JSON) Module configuration to handle {@link Instant} as number of milliseconds since Epoch
 *
 *
 */
public class InstantModule extends SimpleModule {

    public InstantModule() {

        addSerializer(Instant.class, new InstantSerializer());
        addDeserializer(Instant.class, new InstantDeserializer());
    }
}
